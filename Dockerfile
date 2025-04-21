FROM nginx:1.27.5-alpine

LABEL maintainer="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.authors="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.url="https://editor-next.swagger.io" \
      org.opencontainers.image.source="https://github.com/swagger-api/swagger-editor/tree/next"

RUN apk update && apk add --no-cache "tiff>=4.4.0-r4"

COPY ./build /usr/share/nginx/html

EXPOSE 8080

# start nginx
CMD ["nginx", "-g", "daemon off;"]
