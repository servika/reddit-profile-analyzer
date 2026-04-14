export default function AccountInfoCard({ userAbout, trophies = [], moderatedSubreddits = [] }) {
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

  const bannerUrl = userAbout.banner_img?.split('?')[0];
  const hasBanner = bannerUrl && !userAbout.is_default_banner;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {hasBanner && (
        <div className="h-32 bg-gray-200 overflow-hidden">
          <img
            src={bannerUrl}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header: avatar + name + badges */}
        <div className="flex items-start gap-4">
          {userAbout.icon_img && (
            <img
              src={userAbout.icon_img.split('?')[0]}
              alt="Avatar"
              className={`w-16 h-16 rounded-full border-2 border-white shadow ${hasBanner ? '-mt-12 relative z-10' : ''}`}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-800">u/{userAbout.name}</h2>
              {userAbout.id && (
                <span className="text-xs text-gray-400 font-mono">t2_{userAbout.id}</span>
              )}
            </div>
            {userAbout.title && (
              <p className="text-sm text-gray-600 mt-0.5">{userAbout.title}</p>
            )}
            <p className="text-sm text-gray-500">
              Redditor since {formatDate(userAbout.created_utc)}
              {accountAge != null && ` (${accountAge.toLocaleString()} days)`}
            </p>

            {userAbout.description && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{userAbout.description}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {userAbout.is_employee && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  Reddit Admin
                </span>
              )}
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
              {userAbout.is_suspended && (
                <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded-full font-medium">
                  Suspended
                </span>
              )}
              {userAbout.profile_over_18 && (
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full font-medium">
                  NSFW Profile
                </span>
              )}
              {userAbout.hide_from_robots && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  Hidden from Search Engines
                </span>
              )}
              {userAbout.accept_chats === false && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  Chats Disabled
                </span>
              )}
              {userAbout.accept_pms === false && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  PMs Disabled
                </span>
              )}
            </div>

            {userAbout.previous_names?.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                Previous names: {userAbout.previous_names.join(', ')}
              </p>
            )}
          </div>

          {/* Follower count */}
          {userAbout.subscribers != null && (
            <div className="text-center flex-shrink-0">
              <p className="text-2xl font-bold text-gray-700">{formatKarma(userAbout.subscribers)}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
          )}
        </div>

        {/* Karma grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xl font-bold text-orange-600">{formatKarma(userAbout.total_karma)}</p>
            <p className="text-xs text-gray-600">Total Karma</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xl font-bold text-blue-600">{formatKarma(userAbout.link_karma)}</p>
            <p className="text-xs text-gray-600">Post Karma</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xl font-bold text-purple-600">{formatKarma(userAbout.comment_karma)}</p>
            <p className="text-xs text-gray-600">Comment Karma</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-xl font-bold text-amber-600">{formatKarma(userAbout.awardee_karma)}</p>
            <p className="text-xs text-gray-600">Awardee Karma</p>
          </div>
          <div className="text-center p-3 bg-teal-50 rounded-lg">
            <p className="text-xl font-bold text-teal-600">{formatKarma(userAbout.awarder_karma)}</p>
            <p className="text-xs text-gray-600">Awarder Karma</p>
          </div>
        </div>

        {/* Trophies */}
        {trophies.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Trophies ({trophies.length})</h3>
            <div className="flex flex-wrap gap-3">
              {trophies.map((trophy, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100"
                  title={trophy.description || trophy.name}
                >
                  {trophy.icon_70 && (
                    <img src={trophy.icon_70} alt="" className="w-6 h-6" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-800">{trophy.name}</p>
                    {trophy.granted_at && (
                      <p className="text-[10px] text-gray-400">
                        {formatDate(trophy.granted_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Moderated Subreddits */}
        {moderatedSubreddits.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Moderator of ({moderatedSubreddits.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {moderatedSubreddits.map((sub, i) => (
                <a
                  key={i}
                  href={`https://www.reddit.com${sub.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  {sub.icon_img ? (
                    <img src={sub.icon_img.split('?')[0]} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                      r/
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {sub.display_name_prefixed || `r/${sub.name}`}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatKarma(sub.subscribers)} members
                      {sub.over_18 && ' · NSFW'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
