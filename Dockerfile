# Eventually, once everything is public repos, we can use a multi-stage dockerfile
# Step 1: Build
# FROM node:16-alpine3.11 as build-step
# RUN mkdir /app
# WORKDIR /app
# do stuff to build to /app/build, to copy to step 2

# Step 2: Deploy
FROM nginx:1.21.3-alpine AS production

# copy built assets created from external build-step
COPY build /usr/share/nginx/html
# COPY --from=build-step /app/build /usr/share/nginx/html

# some extended nginx configuration
# COPY nginx.conf /etc/nginx/
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# start nginx
CMD ["nginx", "-g", "daemon off;"]
