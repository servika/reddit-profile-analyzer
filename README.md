# Reddit Profile Analyzer

A client-side web application that analyzes Reddit user activity patterns. Enter any public Reddit username to see detailed statistics about their posting behavior.

**[Live Demo](http://reddit.sergb.com/)**

![Reddit Analyzer Screenshot](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Account Overview** - Profile age, total karma, badges (Premium, Moderator, Verified)
- **Subreddit Analysis** - Activity breakdown by subreddit with interactive charts
- **Timeline View** - Posting activity over time (daily/weekly/monthly aggregation)
- **Hourly Patterns** - Activity heatmap across US timezones (EST, CST, MST, PST)
- **Karma Analysis** - Post/comment karma, average scores, engagement metrics
- **Top Content** - Highest/lowest scoring posts, top comments, controversial comments
- **Content Breakdown** - Post types (text/link/image/video), NSFW ratio, linked domains
- **Word Cloud** - Most frequently used words in comments

## Tech Stack

- **Frontend**: React 18 + Vite
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Data Source**: Reddit Public JSON API

## Quick Start

### Prerequisites

- Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/servika/reddit-profile-analyzer.git
cd reddit-profile-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. Enter a Reddit profile URL or username:
   - `https://reddit.com/user/spez`
   - `reddit.com/user/spez`
   - `u/spez`
   - `spez`

2. Click **Analyze** and wait for the data to load

3. Explore the interactive charts and statistics

## Project Structure

```
reddit-profile-analyzer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main application
│   │   ├── components/
│   │   │   ├── AccountInfoCard.jsx # User profile card
│   │   │   ├── ContentBreakdown.jsx# Post type analysis
│   │   │   ├── HourlyHeatmap.jsx   # Activity by hour
│   │   │   ├── KarmaStats.jsx      # Karma metrics
│   │   │   ├── StatsCard.jsx       # Summary statistics
│   │   │   ├── SubredditChart.jsx  # Subreddit breakdown
│   │   │   ├── TimelineChart.jsx   # Activity timeline
│   │   │   ├── TopPosts.jsx        # Best/worst content
│   │   │   ├── UrlInput.jsx        # Search input
│   │   │   └── WordCloud.jsx       # Word frequency
│   │   └── services/
│   │       ├── api.js              # Main API entry
│   │       ├── analyzer.js         # Data analysis logic
│   │       └── redditFetcher.js    # Reddit API client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json
├── LICENSE
└── README.md
```

## Limitations

- **Public data only** - Cannot access private profiles or hidden posts
- **~1000 item limit** - Reddit's API returns approximately the last 1000 posts and 1000 comments
- **CORS proxy** - Uses public CORS proxies which may have rate limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for educational purposes. Please respect Reddit's terms of service and user privacy. Only public data is accessed.
