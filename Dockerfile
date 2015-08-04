###
# swagger-editor - https://github.com/swagger-api/swagger-editor/
#
# Run the swagger-editor service on port 8080
###

FROM    ubuntu:14.04
MAINTAINER Marcello_deSales@intuit.com

ENV     DEBIAN_FRONTEND noninteractive

RUN     apt-get update && apt-get install -y git npm nodejs && rm -rf /var/lib/apt/lists/*
RUN     ln -s /usr/bin/nodejs /usr/local/bin/node

WORKDIR /runtime
ADD     package.json    /runtime/package.json
RUN     npm install
RUN     npm install -g bower grunt-cli


ADD     bower.json      /runtime/bower.json
ADD     .bowerrc        /runtime/.bowerrc
RUN     bower --allow-root --force-latest install

ADD     .   /runtime
RUN 	grunt build

# The default port of the application
EXPOSE  8080
CMD     grunt connect:dist
