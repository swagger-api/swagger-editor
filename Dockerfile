FROM nginx:1.19-alpine

RUN apk --no-cache add nodejs

LABEL maintainer="fehguy"

ENV PORT 8080
ENV BASE_URL ""

COPY ./docker/nginx.conf ./docker/cors.conf /etc/nginx/

COPY ./index.html /usr/share/nginx/html/
COPY ./dist/* /usr/share/nginx/html/
COPY ./docker/run.sh /usr/share/nginx/
COPY ./docker/configurator /usr/share/nginx/configurator

RUN chmod +x /usr/share/nginx/run.sh && \
    chmod -R a+rw /usr/share/nginx && \
    chmod -R a+rw /etc/nginx && \
    chmod -R a+rw /var && \
    chmod -R a+rw /var/run

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/run.sh"]
