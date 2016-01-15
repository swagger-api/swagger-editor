###
# swagger-editor - https://github.com/swagger-api/swagger-editor/
#
# Run the swagger-editor service on port 8080
###

FROM    ubuntu:14.04

RUN     apt-get update && apt-get install -y npm nodejs && rm -rf /var/lib/apt/lists/* && npm install -g http-server
RUN     ln -s /usr/bin/nodejs /usr/local/bin/node

WORKDIR /editor
ADD     dist    /editor

# The default port of the application
EXPOSE  8080

CMD ["http-server", "--cors", "--port=8080", "/editor"]
