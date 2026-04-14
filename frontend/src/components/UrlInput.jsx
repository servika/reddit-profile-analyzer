import { useState } from 'react';

export default function UrlInput({ onAnalyze, isLoading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input) => {
    if (!input.trim()) {
      return 'Please enter a Reddit profile URL or username';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onAnalyze(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="profile-url" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reddit Profile URL or Username
          </label>
          <div className="flex gap-3">
            <input
              id="profile-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="reddit.com/user/username or just username"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </form>
      <p className="mt-3 text-sm text-gray-500 text-center">
        Examples: reddit.com/user/spez, u/spez, or just spez
      </p>
    </div>
  );
}
