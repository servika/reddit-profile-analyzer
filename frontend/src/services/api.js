import { extractUsername, fetchUserActivity, fetchUserAbout } from './redditFetcher';
import { analyzeActivity } from './analyzer';

export async function analyzeProfile(profileUrl, onProgress = null) {
  const username = extractUsername(profileUrl);

  if (!username) {
    throw new Error('Invalid Reddit profile URL. Please provide a valid URL like reddit.com/user/username');
  }

  const [activityResult, userAbout] = await Promise.all([
    fetchUserActivity(username, 10, onProgress),
    fetchUserAbout(username)
  ]);

  const { posts, comments } = activityResult;

  if (posts.length === 0 && comments.length === 0) {
    throw new Error('No activity found for this user. The profile may be private or have no public posts.');
  }

  const analysis = analyzeActivity(posts, comments);

  return {
    username,
    userAbout,
    ...analysis
  };
}
