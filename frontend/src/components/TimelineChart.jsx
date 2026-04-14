import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useMemo } from 'react';

export default function TimelineChart({ timeline }) {
  const [aggregation, setAggregation] = useState('daily');

  const aggregatedData = useMemo(() => {
    if (aggregation === 'daily') {
      return timeline;
    }

    const grouped = {};
    
    timeline.forEach((item) => {
      const date = new Date(item.date);
      let key;
      
      if (aggregation === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!grouped[key]) {
        grouped[key] = { date: key, posts: 0, comments: 0, total: 0 };
      }
      grouped[key].posts += item.posts;
      grouped[key].comments += item.comments;
      grouped[key].total += item.total;
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [timeline, aggregation]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Activity Timeline</h2>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((agg) => (
            <button
              key={agg}
              onClick={() => setAggregation(agg)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                aggregation === agg
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {agg.charAt(0).toUpperCase() + agg.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => {
                if (aggregation === 'monthly') return value;
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value, name) => [value, name === 'posts' ? 'Posts' : 'Comments']}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="posts" 
              stackId="1" 
              stroke="#ff4500" 
              fill="#ff4500" 
              fillOpacity={0.6}
              name="Posts"
            />
            <Area 
              type="monotone" 
              dataKey="comments" 
              stackId="1" 
              stroke="#ff8c00" 
              fill="#ff8c00" 
              fillOpacity={0.6}
              name="Comments"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
