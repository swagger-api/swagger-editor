###
# Swagger-editor runtime dependency with all the needed dependencies installed.
# This dependency will automatically call "grunt serve" after the installation
# on this layer is performed.
###
FROM marcellodesales/swagger-editor-runtime
MAINTAINER Marcello_deSales@intuit.com

# The default port of the application.
EXPOSE 9000

# Runs all the installation of the current dependencies at this image's
# build time, so that is guarantees that all the dependencies are installed.
RUN npm install && bower --allow-root --save --force-latest install
