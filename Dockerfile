FROM nginxinc/nginx-unprivileged:1.18-alpine

LABEL authors="fehguy"

USER root

# copy swagger files to the `/js` folder
COPY ./index.html /usr/share/nginx/html/
ADD ./dist/*.js /usr/share/nginx/html/dist/
ADD ./dist/*.map /usr/share/nginx/html/dist/
ADD ./dist/*.css /usr/share/nginx/html/dist/
ADD ./dist/*.png /usr/share/nginx/html/dist/
ADD ./docker-run.sh /usr/share/nginx/

# needed for gzip after replacements / SWAGGER_FILE
RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

USER 1001

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
