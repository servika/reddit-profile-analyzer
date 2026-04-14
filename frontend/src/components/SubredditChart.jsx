import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SubredditChart({ subreddits }) {
  const topSubreddits = subreddits.slice(0, 15);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Top Subreddits ({subreddits.length} total)
      </h2>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topSubreddits}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `r/${value}`}
            />
            <Tooltip 
              formatter={(value, name) => [value, name === 'posts' ? 'Posts' : 'Comments']}
              labelFormatter={(label) => `r/${label}`}
            />
            <Legend />
            <Bar dataKey="posts" stackId="a" fill="#ff4500" name="Posts" />
            <Bar dataKey="comments" stackId="a" fill="#ff8c00" name="Comments" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 max-h-48 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left py-2 px-3">Subreddit</th>
              <th className="text-right py-2 px-3">Posts</th>
              <th className="text-right py-2 px-3">Comments</th>
              <th className="text-right py-2 px-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {subreddits.map((sub) => (
              <tr key={sub.name} className="border-t border-gray-100">
                <td className="py-2 px-3">r/{sub.name}</td>
                <td className="text-right py-2 px-3">{sub.posts}</td>
                <td className="text-right py-2 px-3">{sub.comments}</td>
                <td className="text-right py-2 px-3 font-medium">{sub.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
