export default function StatsCard({ data }) {
  const { stats, totalPosts, totalComments, totalActivity } = data;

  const statItems = [
    { label: 'Total Posts', value: totalPosts.toLocaleString() },
    { label: 'Total Comments', value: totalComments.toLocaleString() },
    { label: 'Total Activity', value: totalActivity.toLocaleString() },
    { label: 'First Activity', value: stats.firstActivityDate || 'N/A' },
    { label: 'Last Activity', value: stats.lastActivityDate || 'N/A' },
    { label: 'Active Days', value: stats.accountAgeDays.toLocaleString() },
    { label: 'Avg/Day', value: stats.avgPerDay },
    { label: 'Avg/Week', value: stats.avgPerWeek },
    { label: 'Top Subreddit', value: stats.mostActiveSubreddit ? `r/${stats.mostActiveSubreddit}` : 'N/A' },
    { label: 'Most Active Day', value: stats.mostActiveDay?.day || 'N/A' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-500">{item.value}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
      
      {stats.peakHours && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Peak Activity Hours</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(stats.peakHours).map(([tz, info]) => (
              <div key={tz} className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-lg font-semibold text-orange-600">{info.formatted}</p>
                <p className="text-sm text-gray-600">{tz}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
