#! /bin/sh

set -e

NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html
NGINX_CONF=/etc/nginx/conf.d/default.conf


## Adding env var support for file passed with URL env variable
## When set, URL has priority over SWAGGER_FILE
if [ -d "$SWAGGER_DIR" ]; then
  # Copy the entire Swagger directory to the NGINX root
  cp -r "$SWAGGER_DIR"/* "$NGINX_ROOT"

  # Update NGINX configuration to serve files from the new directory
  if [ -z "$SWAGGER_ROOT" ]; then
    SWAGGER_ROOT="$SWAGGER_DIR"
  fi

  if [ "$BASE_URL" != "/" ]; then
    BASE_URL=$(echo "$BASE_URL" | sed 's/\/$//') # Remove trailing slash if present
    sed -i \
      "s|#SWAGGER_ROOT|rewrite ^$BASE_URL(/.*)$ \$1 break;\n        #SWAGGER_ROOT|" \
      "$NGINX_CONF"
  fi
  sed -i "s|#SWAGGER_ROOT|root $SWAGGER_ROOT/;|g" "$NGINX_CONF"
fi

## Adding env var support for `queryConfigEnabled` core configuration parameter of SwaggerUI
if [[ "${QUERY_CONFIG_ENABLED}" = "true" ]]; then
  sed -i "s|queryConfigEnabled: false|queryConfigEnabled: true|" $INDEX_FILE
fi

## Gzip after replacements
#find /usr/share/nginx/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
#
#exec nginx -g 'daemon off;'
