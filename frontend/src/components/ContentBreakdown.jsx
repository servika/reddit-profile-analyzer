import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#ff4500', '#ff8c00', '#ffa500', '#ffb347', '#ffd700', '#98d8c8'];

const TYPE_LABELS = {
  text: 'Text Posts',
  link: 'Links',
  image: 'Images',
  video: 'Videos',
  gallery: 'Galleries',
  crosspost: 'Crossposts'
};

export default function ContentBreakdown({ contentTypes }) {
  const pieData = contentTypes.contentTypeBreakdown.map((item, idx) => ({
    name: TYPE_LABELS[item.type] || item.type,
    value: item.count,
    percentage: item.percentage
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Analysis</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-xl font-bold text-red-600">{contentTypes.nsfwCount}</p>
          <p className="text-xs text-gray-600">NSFW Posts ({contentTypes.nsfwPercentage}%)</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <p className="text-xl font-bold text-yellow-600">{contentTypes.spoilerCount}</p>
          <p className="text-xs text-gray-600">Spoiler Posts ({contentTypes.spoilerPercentage}%)</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-xl font-bold text-blue-600">{contentTypes.topDomains.length}</p>
          <p className="text-xs text-gray-600">Unique Domains</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-xl font-bold text-green-600">{contentTypes.contentTypeBreakdown.length}</p>
          <p className="text-xs text-gray-600">Content Types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Post Types</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Posts']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Top Domains</h3>
          {contentTypes.topDomains.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={contentTypes.topDomains.slice(0, 8)} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="domain" 
                    tick={{ fontSize: 10 }}
                    width={75}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff4500" name="Links" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No external links found
            </div>
          )}
        </div>
      </div>

      {contentTypes.topDomains.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">All Domains</h3>
          <div className="flex flex-wrap gap-2">
            {contentTypes.topDomains.map((d, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {d.domain} ({d.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
