import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

export default function HourlyHeatmap({ hourlyActivity, dayOfWeek }) {
  const [selectedTimezone, setSelectedTimezone] = useState('EST');
  const timezones = Object.keys(hourlyActivity);

  const hourlyData = HOURS.map((hour) => ({
    hour,
    label: formatHour(hour),
    activity: hourlyActivity[selectedTimezone][hour]
  }));

  const dayData = Object.entries(dayOfWeek).map(([day, count]) => ({
    day,
    count
  }));

  const maxActivity = Math.max(...hourlyData.map(d => d.activity));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Hourly Activity</h2>
          <div className="flex gap-2">
            {timezones.map((tz) => (
              <button
                key={tz}
                onClick={() => setSelectedTimezone(tz)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedTimezone === tz
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 10 }}
                interval={1}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Activity']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Bar 
                dataKey="activity" 
                fill="#ff4500"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Activity Heatmap ({selectedTimezone})</h3>
          <div className="flex gap-1 justify-center flex-wrap">
            {hourlyData.map((item) => {
              const intensity = maxActivity > 0 ? item.activity / maxActivity : 0;
              return (
                <div
                  key={item.hour}
                  className="w-10 h-10 rounded flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: `rgba(255, 69, 0, ${0.1 + intensity * 0.9})`,
                    color: intensity > 0.5 ? 'white' : '#333'
                  }}
                  title={`${item.label}: ${item.activity} activities`}
                >
                  {item.hour}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
            <span>12 AM</span>
            <span className="flex-1 text-center">Hour of Day</span>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Day of Week Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Activity']} />
              <Bar 
                dataKey="count" 
                fill="#ff8c00"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
