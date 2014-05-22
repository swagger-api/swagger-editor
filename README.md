# Swagger Editor

Swagger Editor lets you edit swagger specs in YAML inside your browser and preview documentations in real time.
[Click Here](http://wordnik.github.io/swagger-editor) to see it right now.

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
Please do not touch `gh-pages` branch manually


### Contributing
Please use Gihub bug tracker for reporting bugs or pull requests.
