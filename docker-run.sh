#! /bin/sh

set -e

BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html
NGINX_CONF=/etc/nginx/nginx.conf

if [[ "${BASE_URL}" != "/" ]]; then
  sed -i "s|location / {|location $BASE_URL {|g" $NGINX_CONF
fi

## Adding env var support for swagger file (json or yaml)
if [[ -f "$SWAGGER_FILE" ]]; then
  cp -s "$SWAGGER_FILE" "$NGINX_ROOT"
  REL_PATH="/$(basename $SWAGGER_FILE)"
  sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      url: '$REL_PATH',|g" $INDEX_FILE

  if [[ -z "$SWAGGER_ROOT" ]]; then
    SWAGGER_ROOT="$(dirname $SWAGGER_FILE)"
  fi

  if [[ "$BASE_URL" != "/" ]]
  then
    BASE_URL=$(echo $BASE_URL | sed 's/\/$//')
    sed -i \
      "s|#SWAGGER_ROOT|rewrite ^$BASE_URL(/.*)$ \$1 break;\n        #SWAGGER_ROOT|" \
      $NGINX_CONF
  fi
  sed -i "s|#SWAGGER_ROOT|root $SWAGGER_ROOT/;|g" $NGINX_CONF
fi

## Adding env var support for `queryConfigEnabled` core configuration parameter of SwaggerUI
if [[ "${QUERY_CONFIG_ENABLED}" = "true" ]]; then
  sed -i 's|queryConfigEnabled: false|queryConfigEnabled: true|' $INDEX_FILE
fi



sed -i 's/queryConfigEnabled: false/queryConfigEnabled: true'/ file.js

## Gzip after replacements
#find /usr/share/nginx/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
#
#exec nginx -g 'daemon off;'
