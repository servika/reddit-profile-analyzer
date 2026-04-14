import { useState } from 'react';
import UrlInput from './components/UrlInput';
import StatsCard from './components/StatsCard';
import SubredditChart from './components/SubredditChart';
import TimelineChart from './components/TimelineChart';
import HourlyHeatmap from './components/HourlyHeatmap';
import AccountInfoCard from './components/AccountInfoCard';
import KarmaStats from './components/KarmaStats';
import TopPosts from './components/TopPosts';
import ContentBreakdown from './components/ContentBreakdown';
import WordCloud from './components/WordCloud';
import { analyzeProfile } from './services/api';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleAnalyze = async (profileUrl) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setProgress(null);

    try {
      const result = await analyzeProfile(profileUrl, (prog) => {
        setProgress(prog);
      });
      setData(result);
    } catch (err) {
      const message = err.message || 'An error occurred while analyzing the profile';
      setError(message);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <svg className="w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reddit Analyzer</h1>
              <p className="text-sm text-gray-500">Comprehensive analysis of Reddit user activity</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Fetching and analyzing Reddit activity...</p>
            {progress && (
              <p className="text-sm text-orange-600 font-medium">
                Page {progress.page}: {progress.posts} posts, {progress.comments} comments
              </p>
            )}
            <p className="text-sm text-gray-400">This may take a moment for active users</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Analysis for u/{data.username}
              </h2>
              <p className="text-gray-500">
                {data.totalPosts} posts, {data.totalComments} comments analyzed
              </p>
            </div>

            {data.userAbout && (
              <AccountInfoCard
                userAbout={data.userAbout}
                trophies={data.trophies}
                moderatedSubreddits={data.moderatedSubreddits}
              />
            )}

            <StatsCard data={data} />

            {data.karma && data.engagement && (
              <KarmaStats karma={data.karma} engagement={data.engagement} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubredditChart subreddits={data.subreddits} />
              <HourlyHeatmap 
                hourlyActivity={data.hourlyActivity} 
                dayOfWeek={data.dayOfWeek} 
              />
            </div>

            <TimelineChart timeline={data.timeline} />

            {data.karma && (
              <TopPosts karma={data.karma} />
            )}

            {data.contentTypes && (
              <ContentBreakdown contentTypes={data.contentTypes} />
            )}

            {data.wordFrequency && (
              <WordCloud wordFrequency={data.wordFrequency} />
            )}
          </div>
        )}

        {!data && !isLoading && !error && (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg">Enter a Reddit profile URL to get started</p>
            <p className="text-sm mt-2">See karma stats, top posts, word analysis, and more</p>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>Reddit Analyzer - Comprehensive analysis of public Reddit user activity</p>
      </footer>
    </div>
  );
}
