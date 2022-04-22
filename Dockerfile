FROM nginxinc/nginx-unprivileged:1.23.2-alpine

LABEL maintainer="fehguy"

ENV BASE_URL ""

COPY nginx.conf /etc/nginx/

COPY ./index.html /usr/share/nginx/html/
COPY ./dist/oauth2-redirect.html /usr/share/nginx/html/
COPY ./dist/* /usr/share/nginx/html/dist/
COPY ./docker-run.sh /usr/share/nginx/

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
