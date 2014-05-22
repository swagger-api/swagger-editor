# Swagger Editor

Swagger Editor lets you edit API specifications in YAML inside your browser and to preview documentations in real time.
Valid Swagger JSON descriptions can then be generated and used with the full Swagger tooling (code generation, documentation, etc).

[Click Here](http://wordnik.github.io/swagger-editor) to try it now.

## YAML Syntax
Expect the syntax to evolve quickly! (Note: the initial simplified syntax can be found under app/spec-files/consolidated.yaml if not available at launch.)

The idea is to iterate quickly on top of the Swagger 1.2 description format. As part of the Swagger 2.0 working group, the syntax will be a first-class citizen of Swagger 2.0. Visit http://swagger.wordnik.com to learn more or to get involved.

## Running Locally

#### Install required dependencies on your machine
 * [NodeJS](http://nodejs.org/)
 * [Ruby](https://www.ruby-lang.org/en/)
 * [Compass](http://compass-style.org/)


#### Clone the repository and install packages

    git clone git@github.com:wordnik/phonics.git
    npm install
    bower install
    npm run fix-coffee
    grunt serve

This will open a browser window running current development version.

#### Problem with CoffeeScript Grunt Module

We need to update grunt-contrib-coffee's coffee-script version to `1.6.0` to avoid some issues. If you have issues with CoffeeScript, run following npm command to fix it: 

```
$ npm run fix-coffee
```

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
