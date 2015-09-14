# Swagger Editor

[![Build Status](https://travis-ci.org/swagger-api/swagger-editor.svg?branch=master)](https://travis-ci.org/swagger-api/swagger-editor)
[![Code Climate](https://codeclimate.com/github/swagger-api/swagger-editor/badges/gpa.svg)](https://codeclimate.com/github/swagger-api/swagger-editor)

Swagger Editor lets you edit [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

**[LIVE DEMO](http://editor.swagger.io)**

[![Screenshot of the Swagger Editor](docs/screenshot.png "Designing an API with the Swagger Editor")](http://editor.swagger.io)

#### Running Locally

##### Manually

[**Download the latest release (v2.9.7)**](https://github.com/swagger-api/swagger-editor/releases/download/v2.9.7/swagger-editor.zip) and serve the static files via your HTTP server. If you don't have an HTTP server, you can use [`http-server`](https://www.npmjs.com/package/http-server) Node.js module.

###### Using `http-server` module:

    npm install -g http-server
    wget https://github.com/swagger-api/swagger-editor/releases/download/v2.9.7/swagger-editor.zip
    unzip swagger-editor.zip
    http-server swagger-editor

##### With docker

A `Dockerfile` is provided with this repo:

    docker build -t swagger/editor .
    docker run -d -p 8080:8080 swagger/editor

Now you will have access to your editor in the port 8080 of your docker host.

#### Building From Source

Make sure you have [Node.js](http://nodejs.org/) installed.

    git clone https://github.com/swagger-api/swagger-editor.git
    cd swagger-editor
    npm start

#### Documentations

* [Why "Try this operation" is not working?](docs/cors.md)
* [Importing your Swagger document](./docs/import.md)
* [Development Guide](./docs/development.md)
* [Configuration Guide](./docs/config.md)

[Contributing](./CONTRIBUTING.md)

[LICENSE](./LICENSE)
