export default function AccountInfoCard({ userAbout }) {
  if (!userAbout) return null;

  const accountAge = userAbout.created_utc 
    ? Math.floor((Date.now() / 1000 - userAbout.created_utc) / (60 * 60 * 24))
    : null;

  const formatDate = (utc) => {
    if (!utc) return 'N/A';
    return new Date(utc * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatKarma = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {userAbout.icon_img && (
          <img 
            src={userAbout.icon_img.split('?')[0]} 
            alt="Avatar" 
            className="w-16 h-16 rounded-full"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">u/{userAbout.name}</h2>
          <p className="text-sm text-gray-500">
            Redditor since {formatDate(userAbout.created_utc)}
            {accountAge && ` (${accountAge.toLocaleString()} days)`}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {userAbout.is_gold && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                Premium
              </span>
            )}
            {userAbout.is_mod && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                Moderator
              </span>
            )}
            {userAbout.has_verified_email && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                Verified Email
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-2xl font-bold text-orange-600">{formatKarma(userAbout.total_karma)}</p>
          <p className="text-sm text-gray-600">Total Karma</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{formatKarma(userAbout.link_karma)}</p>
          <p className="text-sm text-gray-600">Post Karma</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{formatKarma(userAbout.comment_karma)}</p>
          <p className="text-sm text-gray-600">Comment Karma</p>
        </div>
      </div>
    </div>
  );
}
