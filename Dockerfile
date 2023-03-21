FROM nginx:1.23.3-alpine

LABEL maintainer="fehguy"

ENV BASE_URL "/"

COPY default.conf /etc/nginx/templates/default.conf.template

COPY ./index.html /usr/share/nginx/html/
COPY ./dist/oauth2-redirect.html /usr/share/nginx/html/
COPY ./dist/* /usr/share/nginx/html/dist/
COPY ./docker-run.sh /docker-entrypoint.d/91-docker-run.sh

RUN chmod +x /docker-entrypoint.d/91-docker-run.sh

EXPOSE 8080
