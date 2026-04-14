import { useState } from 'react';

export default function TopPosts({ karma }) {
  const [activeTab, setActiveTab] = useState('topPosts');

  const tabs = [
    { id: 'topPosts', label: 'Top Posts', data: karma.topPosts },
    { id: 'bottomPosts', label: 'Lowest Posts', data: karma.bottomPosts },
    { id: 'topComments', label: 'Top Comments', data: karma.topComments },
    { id: 'controversial', label: `Controversial (${karma.controversialCount})`, data: karma.controversialComments }
  ];

  const activeData = tabs.find(t => t.id === activeTab)?.data || [];

  const formatDate = (utc) => {
    return new Date(utc * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatScore = (score) => {
    if (score >= 10000) return (score / 1000).toFixed(1) + 'k';
    return score.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Content</h2>
      
      <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeData.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items found</p>
        ) : (
          activeData.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`text-center min-w-[50px] px-2 py-1 rounded ${
                  item.score >= 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  <span className="font-bold">{formatScore(item.score)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {item.title ? (
                    <a 
                      href={`https://reddit.com${item.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-800 hover:text-orange-600 line-clamp-2"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Re: {item.link_title?.substring(0, 60)}{item.link_title?.length > 60 ? '...' : ''}
                      </p>
                      <a 
                        href={`https://reddit.com${item.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-orange-600 text-sm"
                      >
                        {item.body}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="text-orange-600">r/{item.subreddit}</span>
                    <span>•</span>
                    <span>{formatDate(item.created_utc)}</span>
                    {item.num_comments !== undefined && (
                      <>
                        <span>•</span>
                        <span>{item.num_comments} comments</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
