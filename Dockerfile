FROM alpine:3.4

MAINTAINER fehguy

RUN apk add --update nginx
RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/

# copy swagger files to the `/js` folder
COPY ./index.html /usr/share/nginx/html/
ADD ./dist/*.js /usr/share/nginx/html/dist/
ADD ./dist/*.map /usr/share/nginx/html/dist/
ADD ./dist/*.css /usr/share/nginx/html/dist/
ADD ./dist/*.png /usr/share/nginx/html/dist/
ADD ./docker-run.sh /usr/share/nginx/

EXPOSE 8080

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
