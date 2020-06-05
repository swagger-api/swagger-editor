#! /bin/sh

set -e

NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html

# TODO: this is empty but we'll be adding configuration values here

## Adding env var support for swagger file (json or yaml)
if [[ -f "$SWAGGER_FILE" ]]; then
  cp -s "$SWAGGER_FILE" "$NGINX_ROOT"
  REL_PATH="/$(basename $SWAGGER_FILE)"
  sed -i "s|https://petstore.swagger.io/v2/swagger.json|$REL_PATH|g" $INDEX_FILE
fi

# Gzip after replacements
find /usr/share/nginx/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;

exec nginx -g 'daemon off;'
