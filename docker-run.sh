#! /bin/sh

set -e

NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html
NGINX_CONF=/etc/nginx/conf.d/default.conf

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
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      swagger2GeneratorUrl: '${URL_SWAGGER2_GENERATOR}',|g" $INDEX_FILE
  else
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      swagger2GeneratorUrl: null,|g" $INDEX_FILE
  fi
fi

if [[ "${URL_SWAGGER2_CONVERTER}" ]]; then
  if [[ "$URL_SWAGGER2_CONVERTER" != "null" ]]; then
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      swagger2ConverterUrl: '${URL_SWAGGER2_CONVERTER}',|g" $INDEX_FILE
  else
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      swagger2ConverterUrl: null,|g" $INDEX_FILE
  fi
fi

if [[ "${URL_OAS3_GENERATOR}" ]]; then
  if [[ "$URL_OAS3_GENERATOR" != "null" ]]; then
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      oas3GeneratorUrl: '${URL_OAS3_GENERATOR}',|g" $INDEX_FILE
  else
    sed -i "s|SwaggerEditorBundle({|SwaggerEditorBundle({\n      oas3GeneratorUrl: null,|g" $INDEX_FILE
  fi
fi

## Adding Google Tag Manager if GTM is set
if [[ "${GTM}" ]]; then
  GTM_SCRIPT="<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');</script>"
  GTM_NOSCRIPT="<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=${GTM}\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>"

  # Escape the strings for sed inline
  GTM_SCRIPT_ESCAPED=$(echo "$GTM_SCRIPT" | sed -e 's/[\/&]/\\&/g')
  GTM_NOSCRIPT_ESCAPED=$(echo "$GTM_NOSCRIPT" | sed -e 's/[\/&]/\\&/g')

  # Perform the replacements
  sed -i "s~<!-- Google Tag Manager -->~$GTM_SCRIPT_ESCAPED~" $INDEX_FILE
  sed -i "s~<!-- Google Tag Manager (noscript) -->~$GTM_NOSCRIPT_ESCAPED~" $INDEX_FILE
fi

## Gzip after replacements
#find /usr/share/nginx/html/ -type f -regex ".*\.\(html\|js\|css\)" -exec sh -c "gzip < {} > {}.gz" \;
#
#exec nginx -g 'daemon off;'
