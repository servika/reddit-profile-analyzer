import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function KarmaStats({ karma, engagement }) {
  const karmaData = [
    { name: 'Post Karma', value: karma.totalPostKarma, color: '#ff4500' },
    { name: 'Comment Karma', value: karma.totalCommentKarma, color: '#ff8c00' }
  ];

  const avgData = [
    { name: 'Avg Post Score', value: karma.avgPostScore },
    { name: 'Avg Comment Score', value: karma.avgCommentScore }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Karma & Engagement</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-xl font-bold text-orange-600">{formatNumber(karma.totalPostKarma)}</p>
          <p className="text-xs text-gray-600">Post Karma</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <p className="text-xl font-bold text-amber-600">{formatNumber(karma.totalCommentKarma)}</p>
          <p className="text-xs text-gray-600">Comment Karma</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xl font-bold text-blue-600">{karma.avgPostScore}</p>
          <p className="text-xs text-gray-600">Avg Post Score</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-xl font-bold text-purple-600">{karma.avgCommentScore}</p>
          <p className="text-xs text-gray-600">Avg Comment Score</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xl font-bold text-green-600">{engagement.avgUpvoteRatio}%</p>
          <p className="text-xs text-gray-600">Avg Upvote Ratio</p>
        </div>
        <div className="text-center p-3 bg-teal-50 rounded-lg">
          <p className="text-xl font-bold text-teal-600">{engagement.avgComments}</p>
          <p className="text-xs text-gray-600">Avg Comments/Post</p>
        </div>
        <div className="text-center p-3 bg-indigo-50 rounded-lg">
          <p className="text-xl font-bold text-indigo-600">{formatNumber(engagement.totalCommentsReceived)}</p>
          <p className="text-xs text-gray-600">Total Comments Received</p>
        </div>
        <div className="text-center p-3 bg-rose-50 rounded-lg">
          <p className="text-xl font-bold text-rose-600">{karma.controversialCount}</p>
          <p className="text-xs text-gray-600">Controversial Comments</p>
        </div>
      </div>

      {engagement.subredditEngagement && engagement.subredditEngagement.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Engagement by Subreddit</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={engagement.subredditEngagement.slice(0, 8)} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="subreddit" 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `r/${v}`}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'totalScore' ? 'Total Score' : 'Total Comments']}
                  labelFormatter={(label) => `r/${label}`}
                />
                <Bar dataKey="totalScore" fill="#ff4500" name="Total Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
