# Cloudflare Worker - Reddit CORS Proxy

This worker acts as a CORS proxy for Reddit API requests.

## Setup (5 minutes)

1. Go to [Cloudflare Workers](https://workers.cloudflare.com/) and sign up (free)

2. Click "Create a Worker"

3. Replace the default code with the contents of `worker.js`

4. Click "Save and Deploy"

5. Copy your worker URL (e.g., `https://reddit-proxy.YOUR-SUBDOMAIN.workers.dev`)

6. Update the frontend to use your worker URL

## Usage

```
https://your-worker.workers.dev/?url=https://www.reddit.com/user/USERNAME/about.json
```

## Free Tier Limits

- 100,000 requests/day
- More than enough for personal use
