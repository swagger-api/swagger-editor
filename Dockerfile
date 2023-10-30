FROM nginx:1.25.3-alpine

LABEL maintainer="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.authors="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.url="https://editor.swagger.io" \
      org.opencontainers.image.source="https://github.com/swagger-api/swagger-editor"

ENV BASE_URL="/" \
    PORT="8080"

RUN apk update && apk add --no-cache "tiff>=4.4.0-r4"

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY ./index.html /usr/share/nginx/html/
COPY ./dist/oauth2-redirect.html /usr/share/nginx/html/
COPY ./dist/* /usr/share/nginx/html/dist/
COPY ./docker-run.sh /docker-entrypoint.d/91-docker-run.sh

RUN chmod +x /docker-entrypoint.d/91-docker-run.sh

EXPOSE 8080
