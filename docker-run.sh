#! /bin/sh

set -e

BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html
NGINX_CONF=/etc/nginx/nginx.conf

if [[ "${BASE_URL}" != "/" ]]; then
  sed -i "s|location / {|location $BASE_URL {|g" $NGINX_CONF
fi

## Adding env var support for file passed with URL env variable
## When set, URL has priority over SWAGGER_FILE
if [[ "${URL}" ]]; then
  sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      url: '${URL}',|g" $INDEX_FILE
## Adding env var support for swagger file (json or yaml)
elif [[ -f "$SWAGGER_FILE" ]]; then
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
  sed -i "s|queryConfigEnabled: false|queryConfigEnabled: true|" $INDEX_FILE
fi

if [[ "${URL_SWAGGER2_GENERATOR}" ]]; then
  if [[ "$URL_SWAGGER2_GENERATOR" != "null" ]]; then
    sed -i "s|swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json'|swagger2GeneratorUrl: '${URL_SWAGGER2_GENERATOR}'|g" $INDEX_FILE
  else
    sed -i "s|swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json'|swagger2GeneratorUrl: null|g" $INDEX_FILE
  fi
fi
if [[ "${URL_OAS3_GENERATOR}" ]]; then
  if [[ "$URL_OAS3_GENERATOR" != "null" ]]; then
    sed -i "s|oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json'|oas3GeneratorUrl: '${URL_OAS3_GENERATOR}'|g" $INDEX_FILE
  else
    sed -i "s|oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json'|oas3GeneratorUrl: null|g" $INDEX_FILE
  fi
fi
if [[ "${URL_SWAGGER2_CONVERTER}" ]]; then
  if [[ "$URL_SWAGGER2_CONVERTER" != "null" ]]; then
    sed -i "s|swagger2ConverterUrl: 'https://converter.swagger.io/api/convert'|swagger2ConverterUrl: '${URL_SWAGGER2_CONVERTER}'|g" $INDEX_FILE
  else
    sed -i "s|swagger2ConverterUrl: 'https://converter.swagger.io/api/convert'|swagger2ConverterUrl: null|g" $INDEX_FILE
  fi
fi

exec nginx -g 'daemon off;'

## Gzip after replacements
#find /usr/share/nginx/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
#
#exec nginx -g 'daemon off;'
