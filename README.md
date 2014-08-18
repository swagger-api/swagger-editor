# Swagger Editor

[![Build Status](https://travis-ci.org/wordnik/swagger-editor.svg)](https://travis-ci.org/wordnik/swagger-editor)

Swagger Editor lets you edit API specifications in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

To understand how it works, you should [try the live demo](http://wordnik.github.io/swagger-editor)!

## YAML Syntax
Expect the syntax to evolve quickly! (Note: the initial simplified syntax can be found under app/spec-files/consolidated.yaml if not available at launch.)

The idea is to iterate quickly on top of the Swagger 1.2 description format. As part of the Swagger 2.0 working group, the syntax will be a first-class citizen of Swagger 2.0. Visit http://swagger.wordnik.com to learn more or to get involved.

![Screenshot of the Swagger Editor](https://blog.apigee.com/sites/blog/files/SwaggerEditor.png "Designing an API with the Swagger Editor")

## Running Locally

#### Install required dependencies on your machine
 * [NodeJS](http://nodejs.org/)
 * [Ruby](https://www.ruby-lang.org/en/)
 * [Compass](http://compass-style.org/)
 
```shell
    # Make sure you have all dependencies
    which ruby
    which node
    which compass
```


#### Clone the repository and install packages

    git clone git@github.com:wordnik/swagger-editor.git
    cd swagger-editor
    npm install
    bower install
    grunt serve

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


### Contributing
File issues in GitHub's to report bugs or issue a pull request.

All contributions must grant copyright permission to this project, the source of which is declared to be under an Apache 2 license (see LICENSE).
