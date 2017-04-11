#! /bin/sh

set -e

INDEX_FILE=/usr/share/nginx/html/index.html

# TODO: this is empty but we'll be adding configuration values here

exec nginx -g 'daemon off;'