FROM node:16.16-alpine as build

RUN apk add git

WORKDIR /apifant-editor

COPY package.json .
COPY package-lock.json .

RUN npm ci --force

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

LABEL maintainer="florian.ellinger@huk-coburg.de"

ENV BASE_URL="/" \
    PORT="8080"

COPY --from=build --chown=101:101 /apifant-editor/nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build --chown=101:101 /apifant-editor/index.html /usr/share/nginx/html/
COPY --from=build --chown=101:101 /apifant-editor/dist/oauth2-redirect.html /usr/share/nginx/html/
COPY --from=build --chown=101:101 /apifant-editor/dist/* /usr/share/nginx/html/dist/
COPY --from=build --chown=101:101 /apifant-editor/docker-run.sh /docker-entrypoint.d/91-docker-run.sh

USER root
RUN chmod +x /docker-entrypoint.d/91-docker-run.sh
USER nginx

EXPOSE $PORT
