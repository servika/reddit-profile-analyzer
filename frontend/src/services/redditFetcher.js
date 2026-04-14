const REDDIT_BASE_URL = 'https://www.reddit.com';
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];
let currentProxyIndex = 0;

const REQUEST_DELAY = 1500;
const MAX_RETRIES = 3;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractUsername(profileUrl) {
  const patterns = [
    /reddit\.com\/user\/([^\/\?]+)/i,
    /reddit\.com\/u\/([^\/\?]+)/i,
    /^u\/([^\/\?]+)$/i,
    /^\/u\/([^\/\?]+)$/i,
    /^([a-zA-Z0-9_-]+)$/
  ];

  for (const pattern of patterns) {
    const match = profileUrl.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

async function fetchWithProxy(url) {
  const proxyUrl = CORS_PROXIES[currentProxyIndex](url);
  const response = await fetch(proxyUrl);
  
  if (response.status === 429) {
    throw new Error('RATE_LIMITED');
  }
  
  if (response.status === 404) {
    throw new Error('User not found');
  }
  
  if (response.status === 403) {
    throw new Error('Profile is private or suspended');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch {
    if (text.includes('blocked') || text.includes('denied')) {
      throw new Error('PROXY_BLOCKED');
    }
    throw new Error('Invalid JSON response');
  }
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fetchWithProxy(url);
    } catch (err) {
      if (err.message === 'User not found' || err.message === 'Profile is private or suspended') {
        throw err;
      }
      
      if (err.message === 'RATE_LIMITED') {
        console.log(`Rate limited, waiting before retry ${attempt + 1}/${retries}`);
        await delay(5000);
        continue;
      }
      
      if (err.message === 'PROXY_BLOCKED' || err.message.includes('Failed to fetch')) {
        currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
        console.log(`Switching to proxy ${currentProxyIndex + 1}`);
        if (attempt < retries - 1) {
          await delay(1000);
          continue;
        }
      }
      
      if (attempt < retries - 1) {
        console.log(`Request failed, retrying (${attempt + 1}/${retries}): ${err.message}`);
        await delay(2000 * (attempt + 1));
        continue;
      }
      
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchPage(username, type, after = null) {
  let url = `${REDDIT_BASE_URL}/user/${username}/${type}.json?limit=100&raw_json=1`;
  if (after) {
    url += `&after=${after}`;
  }
  return fetchWithRetry(url);
}

export async function fetchUserActivity(username, maxPages = 10, onProgress = null) {
  const allPosts = [];
  const allComments = [];

  let postsAfter = null;
  let commentsAfter = null;
  let postsHasMore = true;
  let commentsHasMore = true;

  for (let page = 0; page < maxPages; page++) {
    const promises = [];

    if (postsHasMore) {
      promises.push(
        fetchPage(username, 'submitted', postsAfter)
          .then(data => ({ type: 'posts', data }))
          .catch(err => ({ type: 'posts', error: err }))
      );
    }

    if (commentsHasMore) {
      promises.push(
        fetchPage(username, 'comments', commentsAfter)
          .then(data => ({ type: 'comments', data }))
          .catch(err => ({ type: 'comments', error: err }))
      );
    }

    if (promises.length === 0) break;

    const results = await Promise.all(promises);

    for (const result of results) {
      if (result.error) {
        if (result.error.message === 'User not found') {
          throw new Error('User not found');
        }
        if (result.error.message === 'Profile is private or suspended') {
          throw new Error('Profile is private or suspended');
        }
        console.error(`Error fetching ${result.type}:`, result.error.message);
        if (result.type === 'posts') postsHasMore = false;
        if (result.type === 'comments') commentsHasMore = false;
        continue;
      }

      const { type, data } = result;
      const children = data?.data?.children || [];

      if (type === 'posts') {
        allPosts.push(...children.map(c => c.data));
        postsAfter = data?.data?.after;
        postsHasMore = !!postsAfter && children.length > 0;
      } else {
        allComments.push(...children.map(c => c.data));
        commentsAfter = data?.data?.after;
        commentsHasMore = !!commentsAfter && children.length > 0;
      }
    }

    if (onProgress) {
      onProgress({ posts: allPosts.length, comments: allComments.length, page: page + 1 });
    }

    if (!postsHasMore && !commentsHasMore) break;

    if (page < maxPages - 1 && (postsHasMore || commentsHasMore)) {
      await delay(REQUEST_DELAY);
    }
  }

  return {
    posts: allPosts,
    comments: allComments
  };
}

export async function fetchUserAbout(username) {
  const url = `${REDDIT_BASE_URL}/user/${username}/about.json?raw_json=1`;
  try {
    const data = await fetchWithRetry(url);
    const user = data?.data || {};
    return {
      name: user.name,
      created_utc: user.created_utc,
      link_karma: user.link_karma || 0,
      comment_karma: user.comment_karma || 0,
      total_karma: (user.link_karma || 0) + (user.comment_karma || 0),
      is_gold: user.is_gold || false,
      is_mod: user.is_mod || false,
      verified: user.verified || false,
      has_verified_email: user.has_verified_email || false,
      icon_img: user.icon_img || null,
      snoovatar_img: user.snoovatar_img || null
    };
  } catch (err) {
    console.error('Error fetching user about:', err.message);
    return null;
  }
}
