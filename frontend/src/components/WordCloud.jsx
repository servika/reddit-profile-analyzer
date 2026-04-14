import { useMemo } from 'react';

export default function WordCloud({ wordFrequency }) {
  const words = useMemo(() => {
    if (!wordFrequency || wordFrequency.length === 0) return [];
    
    const maxCount = wordFrequency[0]?.count || 1;
    const minCount = wordFrequency[wordFrequency.length - 1]?.count || 1;
    
    return wordFrequency.map(item => {
      const normalized = (item.count - minCount) / (maxCount - minCount || 1);
      const size = 12 + normalized * 24;
      const opacity = 0.5 + normalized * 0.5;
      
      return {
        ...item,
        size,
        opacity
      };
    });
  }, [wordFrequency]);

  if (!wordFrequency || wordFrequency.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Word Analysis</h2>
        <p className="text-gray-500 text-center py-8">No comment data available for word analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Most Used Words in Comments
      </h2>
      
      <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px] p-4 bg-gray-50 rounded-lg">
        {words.map((word, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 rounded transition-transform hover:scale-110 cursor-default"
            style={{
              fontSize: `${word.size}px`,
              opacity: word.opacity,
              color: `hsl(${20 + idx * 3}, 80%, ${35 + (1 - word.opacity) * 25}%)`
            }}
            title={`"${word.word}" used ${word.count} times`}
          >
            {word.word}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Top 20 Words</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {wordFrequency.slice(0, 20).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
              <span className="font-medium text-gray-700">{item.word}</span>
              <span className="text-orange-600 font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
