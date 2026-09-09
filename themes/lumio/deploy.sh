#!/bin/bash
set -e

SITE_DIR="/Users/ryc/projects/lumio2/themes/lumio"
REMOTE_HOST="ryc@135.148.61.99"
REMOTE_PATH="/var/www/projects/onemoregreatidea"

cd "$SITE_DIR"

echo "Building Astro site..."
npm run build

echo "Deploying dist/ to $REMOTE_HOST:$REMOTE_PATH ..."
rsync -avz --delete dist/ "$REMOTE_HOST:$REMOTE_PATH/"

echo "Done. Live at https://onemoregreatidea.com"