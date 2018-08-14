FROM node:8.11.3-alpine AS thebuilder
  LABEL stage=intermediate
  RUN apk add --update python gcc g++ make
  # required to build iltorb library
  COPY . /bob
  WORKDIR /bob
  RUN npm install
  RUN npm run build

FROM alpine:3.8
  RUN apk add --update nginx
  RUN mkdir -p /run/nginx

  COPY --from=thebuilder /bob/dist /usr/share/nginx/html/dist
  COPY ./nginx.conf    /etc/nginx/
  COPY ./index.html    /usr/share/nginx/html/
  COPY ./docker-run.sh /usr/share/nginx/

  RUN chown -R nginx:nginx /usr/share/nginx
  RUN chown -R nginx:nginx /var/lib/nginx/
  RUN chown -R nginx:nginx /var/log/nginx/
  RUN chown -R nginx:nginx /run/nginx/

  EXPOSE 8080
  USER nginx

  CMD ["sh", "/usr/share/nginx/docker-run.sh"]
