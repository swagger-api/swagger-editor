# Swagger Editor

[![Build Status](https://travis-ci.org/wordnik/swagger-editor.svg)](https://travis-ci.org/wordnik/swagger-editor)
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

#### Install required dependencies on your machine

Make sure you have all dependencies

```shell
node --version
bower --version
grunt --version
```
If you don't have any of the dependencies, install them from their websites:

 * [NodeJS](http://nodejs.org/)
 * [Bower](http://bower.io/)
 * [Grunt](http://gruntjs.com/)
 

#### Clone the repository and install packages

```shell
git clone git@github.com:wordnik/swagger-editor.git
cd swagger-editor
npm install
bower install
grunt serve
```

This will open a browser window running current development version.

## Building and publishing

#### Building
To build the project just run: 

```
$ grunt build
```
This will build a new version of the web app, ready for production in `/dist` folder

#### Pushing to `gh-page`

To copy everything in `/dist` folder to `gh-pages` branch and push it to github, just run:

```
$ grunt ship
```
Please do not touch `gh-pages` branch manually!

### Docker Container

If you are familiar with [Docker](https://www.docker.com/), you can build a
Docker image of the current code using the project's Dockerfile. From the root
of the repo run:

```
sudo docker build -t my-swagger-editor .
```

Where `my-swagger-editor` is the tag for the image.

To run the image as a Docker container, use the following:

```
sudo docker run -ti -p 8080:9000 my-swagger-editor
```

And open [http://localhost:8080](http://localhost:8080) in your browser. Port
8080 in this example may be any available port.

If you want to know more about the process to build the images, go to the
[Docker Node.js Sample tutorial](https://docs.docker.com/examples/nodejs_web_app/).
 
### Contributing
File issues in GitHub's to report bugs or issue a pull request.

All contributions must grant copyright permission to this project, the source of which is declared to be under an Apache 2 license (see LICENSE).
