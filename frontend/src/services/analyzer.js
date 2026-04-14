const US_TIMEZONES = {
  EST: 'America/New_York',
  CST: 'America/Chicago',
  MST: 'America/Denver',
  PST: 'America/Los_Angeles'
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
  'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his',
  'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my',
  'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
  'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
  'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
  'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two',
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been',
  'has', 'had', 'did', 'does', 'doing', 'am', 'being', 'here', 'there', 'where',
  'why', 'how', 'very', 'just', 'too', 'more', 'much', 'really', 'dont', 'im',
  'thats', 'youre', 'ive', 'didnt', 'cant', 'wont', 'isnt', 'arent', 'wasnt',
  'http', 'https', 'www', 'com', 'org', 'net', 'reddit', 'amp', 'gt', 'lt'
]);

function getHourInTimezone(utcTimestamp, timezone) {
  const date = new Date(utcTimestamp * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false
  });
  return parseInt(formatter.format(date), 10);
}

function getDayInTimezone(utcTimestamp, timezone) {
  const date = new Date(utcTimestamp * 1000);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long'
  });
  return formatter.format(date);
}

function getDateString(utcTimestamp) {
  const date = new Date(utcTimestamp * 1000);
  return date.toISOString().split('T')[0];
}

function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function extractWords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function analyzeKarma(posts, comments) {
  const postScores = posts.map(p => p.score || 0);
  const commentScores = comments.map(c => c.score || 0);
  
  const totalPostKarma = postScores.reduce((a, b) => a + b, 0);
  const totalCommentKarma = commentScores.reduce((a, b) => a + b, 0);
  
  const avgPostScore = posts.length > 0 ? (totalPostKarma / posts.length).toFixed(1) : 0;
  const avgCommentScore = comments.length > 0 ? (totalCommentKarma / comments.length).toFixed(1) : 0;
  
  const topPosts = [...posts]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)
    .map(p => ({
      title: p.title,
      subreddit: p.subreddit,
      score: p.score || 0,
      num_comments: p.num_comments || 0,
      created_utc: p.created_utc,
      permalink: p.permalink,
      url: p.url
    }));

  const bottomPosts = [...posts]
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, 5)
    .map(p => ({
      title: p.title,
      subreddit: p.subreddit,
      score: p.score || 0,
      num_comments: p.num_comments || 0,
      created_utc: p.created_utc,
      permalink: p.permalink
    }));

  const topComments = [...comments]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)
    .map(c => ({
      body: c.body?.substring(0, 200) + (c.body?.length > 200 ? '...' : ''),
      subreddit: c.subreddit,
      score: c.score || 0,
      created_utc: c.created_utc,
      permalink: c.permalink,
      link_title: c.link_title
    }));

  const controversialComments = [...comments]
    .filter(c => c.controversiality === 1)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)
    .map(c => ({
      body: c.body?.substring(0, 200) + (c.body?.length > 200 ? '...' : ''),
      subreddit: c.subreddit,
      score: c.score || 0,
      created_utc: c.created_utc,
      permalink: c.permalink,
      link_title: c.link_title
    }));

  return {
    totalPostKarma,
    totalCommentKarma,
    avgPostScore: parseFloat(avgPostScore),
    avgCommentScore: parseFloat(avgCommentScore),
    topPosts,
    bottomPosts,
    topComments,
    controversialComments,
    controversialCount: comments.filter(c => c.controversiality === 1).length
  };
}

function analyzeContentTypes(posts) {
  const contentTypes = {
    text: 0,
    link: 0,
    image: 0,
    video: 0,
    gallery: 0,
    crosspost: 0
  };

  const domains = {};
  let nsfwCount = 0;
  let spoilerCount = 0;

  posts.forEach(post => {
    if (post.over_18) nsfwCount++;
    if (post.spoiler) spoilerCount++;

    if (post.crosspost_parent) {
      contentTypes.crosspost++;
    } else if (post.is_gallery) {
      contentTypes.gallery++;
    } else if (post.is_video || post.media?.reddit_video) {
      contentTypes.video++;
    } else if (post.post_hint === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(post.url || '')) {
      contentTypes.image++;
    } else if (post.is_self) {
      contentTypes.text++;
    } else {
      contentTypes.link++;
    }

    if (post.domain && !post.is_self) {
      const domain = post.domain.replace(/^(www\.)?/, '');
      domains[domain] = (domains[domain] || 0) + 1;
    }
  });

  const contentTypeBreakdown = Object.entries(contentTypes)
    .map(([type, count]) => ({ type, count, percentage: posts.length > 0 ? ((count / posts.length) * 100).toFixed(1) : 0 }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const topDomains = Object.entries(domains)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  return {
    contentTypeBreakdown,
    topDomains,
    nsfwCount,
    nsfwPercentage: posts.length > 0 ? ((nsfwCount / posts.length) * 100).toFixed(1) : 0,
    spoilerCount,
    spoilerPercentage: posts.length > 0 ? ((spoilerCount / posts.length) * 100).toFixed(1) : 0
  };
}

function analyzeEngagement(posts) {
  if (posts.length === 0) {
    return {
      avgComments: 0,
      avgUpvoteRatio: 0,
      totalCommentsReceived: 0,
      postsWithNoComments: 0,
      postsWithHighEngagement: 0
    };
  }

  const commentsReceived = posts.map(p => p.num_comments || 0);
  const upvoteRatios = posts.filter(p => p.upvote_ratio).map(p => p.upvote_ratio);

  const totalCommentsReceived = commentsReceived.reduce((a, b) => a + b, 0);
  const avgComments = (totalCommentsReceived / posts.length).toFixed(1);
  const avgUpvoteRatio = upvoteRatios.length > 0 
    ? ((upvoteRatios.reduce((a, b) => a + b, 0) / upvoteRatios.length) * 100).toFixed(1)
    : 0;

  const postsWithNoComments = posts.filter(p => (p.num_comments || 0) === 0).length;
  const postsWithHighEngagement = posts.filter(p => (p.num_comments || 0) >= 10).length;

  const engagementBySubreddit = {};
  posts.forEach(post => {
    const sub = post.subreddit;
    if (!engagementBySubreddit[sub]) {
      engagementBySubreddit[sub] = { subreddit: sub, posts: 0, totalScore: 0, totalComments: 0 };
    }
    engagementBySubreddit[sub].posts++;
    engagementBySubreddit[sub].totalScore += post.score || 0;
    engagementBySubreddit[sub].totalComments += post.num_comments || 0;
  });

  const subredditEngagement = Object.values(engagementBySubreddit)
    .map(sub => ({
      ...sub,
      avgScore: (sub.totalScore / sub.posts).toFixed(1),
      avgComments: (sub.totalComments / sub.posts).toFixed(1)
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  return {
    avgComments: parseFloat(avgComments),
    avgUpvoteRatio: parseFloat(avgUpvoteRatio),
    totalCommentsReceived,
    postsWithNoComments,
    postsWithHighEngagement,
    subredditEngagement
  };
}

function analyzeWordFrequency(comments, limit = 50) {
  const wordCounts = {};

  comments.forEach(comment => {
    const words = extractWords(comment.body);
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  const wordFrequency = Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return wordFrequency;
}

export function analyzeActivity(posts, comments) {
  const subredditStats = {};
  const timelineMap = {};
  const hourlyActivity = {
    EST: new Array(24).fill(0),
    CST: new Array(24).fill(0),
    MST: new Array(24).fill(0),
    PST: new Array(24).fill(0)
  };
  const dayOfWeek = {};
  DAYS_OF_WEEK.forEach(day => { dayOfWeek[day] = 0; });

  let earliestTimestamp = Infinity;
  let latestTimestamp = 0;

  const processItem = (item, isPost) => {
    const subreddit = item.subreddit;
    const timestamp = item.created_utc;

    if (timestamp < earliestTimestamp) earliestTimestamp = timestamp;
    if (timestamp > latestTimestamp) latestTimestamp = timestamp;

    if (!subredditStats[subreddit]) {
      subredditStats[subreddit] = { name: subreddit, posts: 0, comments: 0, total: 0 };
    }
    if (isPost) {
      subredditStats[subreddit].posts++;
    } else {
      subredditStats[subreddit].comments++;
    }
    subredditStats[subreddit].total++;

    const dateStr = getDateString(timestamp);
    if (!timelineMap[dateStr]) {
      timelineMap[dateStr] = { date: dateStr, posts: 0, comments: 0, total: 0 };
    }
    if (isPost) {
      timelineMap[dateStr].posts++;
    } else {
      timelineMap[dateStr].comments++;
    }
    timelineMap[dateStr].total++;

    for (const [tzName, tzId] of Object.entries(US_TIMEZONES)) {
      const hour = getHourInTimezone(timestamp, tzId);
      hourlyActivity[tzName][hour]++;
    }

    const day = getDayInTimezone(timestamp, US_TIMEZONES.EST);
    dayOfWeek[day]++;
  };

  posts.forEach(post => processItem(post, true));
  comments.forEach(comment => processItem(comment, false));

  const subreddits = Object.values(subredditStats)
    .sort((a, b) => b.total - a.total);

  const timeline = Object.values(timelineMap)
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalPosts = posts.length;
  const totalComments = comments.length;
  const totalActivity = totalPosts + totalComments;

  let firstActivityDate = null;
  let lastActivityDate = null;
  let accountAgeDays = 0;
  let avgPerDay = 0;
  let avgPerWeek = 0;

  if (earliestTimestamp !== Infinity) {
    firstActivityDate = new Date(earliestTimestamp * 1000).toISOString().split('T')[0];
    lastActivityDate = new Date(latestTimestamp * 1000).toISOString().split('T')[0];
    accountAgeDays = Math.ceil((latestTimestamp - earliestTimestamp) / (60 * 60 * 24));
    if (accountAgeDays > 0) {
      avgPerDay = (totalActivity / accountAgeDays).toFixed(2);
      avgPerWeek = (totalActivity / (accountAgeDays / 7)).toFixed(2);
    }
  }

  const mostActiveSubreddit = subreddits.length > 0 ? subreddits[0].name : null;

  const peakHours = {};
  for (const [tzName, hours] of Object.entries(hourlyActivity)) {
    const maxActivity = Math.max(...hours);
    const peakHour = hours.indexOf(maxActivity);
    peakHours[tzName] = {
      hour: peakHour,
      formatted: formatHour(peakHour),
      activity: maxActivity
    };
  }

  const mostActiveDay = Object.entries(dayOfWeek)
    .sort((a, b) => b[1] - a[1])[0];

  const karma = analyzeKarma(posts, comments);
  const contentTypes = analyzeContentTypes(posts);
  const engagement = analyzeEngagement(posts);
  const wordFrequency = analyzeWordFrequency(comments);

  return {
    totalPosts,
    totalComments,
    totalActivity,
    subreddits,
    timeline,
    hourlyActivity,
    dayOfWeek,
    stats: {
      firstActivityDate,
      lastActivityDate,
      accountAgeDays,
      avgPerDay: parseFloat(avgPerDay),
      avgPerWeek: parseFloat(avgPerWeek),
      mostActiveSubreddit,
      peakHours,
      mostActiveDay: mostActiveDay ? { day: mostActiveDay[0], count: mostActiveDay[1] } : null
    },
    karma,
    contentTypes,
    engagement,
    wordFrequency
  };
}
