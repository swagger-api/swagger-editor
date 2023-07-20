FROM nginx:1.25.1-alpine
RUN apk update && apk add --no-cache "tiff>=4.4.0-r4"
COPY ./build /usr/share/nginx/html
EXPOSE 8080
# start nginx
CMD ["nginx", "-g", "daemon off;"]
