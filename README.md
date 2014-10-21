# Swagger Editor

[![Build Status](https://travis-ci.org/wordnik/swagger-editor.svg?branch=master)](https://travis-ci.org/wordnik/swagger-editor)
[![Code Climate](https://codeclimate.com/github/wordnik/swagger-editor/badges/gpa.svg)](https://codeclimate.com/github/wordnik/swagger-editor)

Swagger Editor lets you edit API specifications in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

To understand how it works, you should [try the live demo](http://wordnik.github.io/swagger-editor)!

## YAML Syntax
YAML became a first-class citizen as part of the Swagger 2.0 working group process. Documenation for the YAML syntax will become part of the documentation of the [Swagger 2.0 spec](https://github.com/reverb/swagger-spec).

![Screenshot of the Swagger Editor](https://raw.githubusercontent.com/wordnik/swagger-editor/master/app/images/swagger-editor2.png "Designing an API with the Swagger Editor")

## Tips
You can import an existing YAML spec by using the `import` query parameter. For example:
```
http://editor.swagger.wordnik.com/?import=http://generator.wordnik.com/online/api/swagger.yaml
```

## Running Locally

#### Install Node.js

Make sure you have Node.js installed. If you don't have Node.js, install it from it's [Node.js website](http://nodejs.org/).
This project was tested with Node.js version `0.10`. Make sure you have at least this version.

```shell
node --version
```

#### Clone the repository and start it

```shell
git clone git@github.com:wordnik/swagger-editor.git
cd swagger-editor
npm start
```

This will open a browser window running current development version.

## Development

For development it's preferred to have `grunt` installed globally on your machine.  

### Building
To build the project just run: 

```
$ grunt build
```
This will build a new version of the web app, ready for production in `/dist` folder

### Pushing to `gh-page`

To copy everything in `/dist` folder to `gh-pages` branch and push it to github, just run:

```
$ grunt ship
```
Please do not touch `gh-pages` branch manually!

###  Configuration
See [./docs/config.rst](./docs/config.rst) and [./app/scripts/enums/defaults.js](./app/scripts/enums/defaults.js)

### Run with Docker


If you are familiar with [Docker](https://www.docker.com/), a `Dockerfile` is
provided.

Build an image named `swagger-editor`
```
sudo docker build -t swagger-editor .
```

Run the container, using the local port 8080 (you may change this to any available
port).
```
sudo docker run -ti -p 8080:9000 swagger-editor
```
And open [http://localhost:8080](http://localhost:8080) in your browser

### Contributing
File issues in GitHub's to report bugs or issue a pull request.

All contributions must grant copyright permission to this project, the source of which is declared to be under an Apache 2 license (see LICENSE).
