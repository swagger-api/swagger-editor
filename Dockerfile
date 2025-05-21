FROM nginx:1.27.5-alpine

LABEL maintainer="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.authors="vladimir.gorej@smartbear.com" \
      org.opencontainers.image.url="https://editor-next.swagger.io" \
      org.opencontainers.image.source="https://github.com/swagger-api/swagger-editor/tree/next" \
      org.opencontainers.image.description="SwaggerEditor@5 Docker image"  \
      org.opencontainers.image.licenses="Apache-2.0"


RUN apk add --update-cache --no-cache "libxml2>=2.13.4-r6"

COPY ./build /usr/share/nginx/html

EXPOSE 8080

# start nginx
CMD ["nginx", "-g", "daemon off;"]
