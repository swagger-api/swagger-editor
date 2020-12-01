FROM nginx:1.19-alpine

LABEL maintainer="fehguy"

ENV BASE_URL ""

RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/

COPY ./index.html /usr/share/nginx/html/
COPY ./dist/* /usr/share/nginx/html/
COPY ./docker-run.sh /usr/share/nginx/

RUN chmod +x /usr/share/nginx/docker-run.sh

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
