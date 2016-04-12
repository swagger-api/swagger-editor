###
# swagger-editor - https://github.com/swagger-api/swagger-editor/
#
# Run the swagger-editor service on port 8080
###

FROM    mhart/alpine-node

RUN     npm install -g http-server

WORKDIR /editor
ADD     ./    /editor

# The default port of the application
EXPOSE  8080

CMD ["http-server", "--cors", "-p8080", "/editor"]
