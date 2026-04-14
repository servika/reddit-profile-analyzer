#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env file not found. Create one with FTP_SERVER, FTP_USERNAME, FTP_PASSWORD."
  exit 1
fi

source "$ENV_FILE"

: "${FTP_SERVER:?Missing FTP_SERVER in .env}"
: "${FTP_USERNAME:?Missing FTP_USERNAME in .env}"
: "${FTP_PASSWORD:?Missing FTP_PASSWORD in .env}"
: "${FTP_REMOTE_PATH:=/}"

echo "Building..."
npm run build --prefix "$SCRIPT_DIR/frontend"

echo "Deploying to $FTP_SERVER:$FTP_REMOTE_PATH ..."
lftp -c "
  set ftp:ssl-allow no;
  open -u $FTP_USERNAME,$FTP_PASSWORD $FTP_SERVER;
  mirror --reverse --delete --verbose $SCRIPT_DIR/frontend/dist/ $FTP_REMOTE_PATH;
  quit
"

echo "Deploy complete."
