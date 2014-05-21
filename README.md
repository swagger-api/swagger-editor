# Swagger Editor

Swagger Editor lets you edit swagger specs in YAML inside your browser and preview documentations in real time.


## View App

[Click Here](http://apigee.github.io/phonics/) to see it right now.

## Running Locally

#### Install required dependencies on your machine
 * [NodeJS](http://nodejs.org/)
 * [Ruby](https://www.ruby-lang.org/en/)
 * [Compass](http://compass-style.org/)


#### Clone the repository and install packages

    git clone git@github.com:apigee/phonics.git
    npm install
    bower install
    npm run fix-coffee
    grunt serve

This will open a browser window running current development version.
## Building

Just run: 

```
$ grunt build
```
This will build a new version of the web app, ready for production in `/dist` folder

## Pushing to `gh-page`

To copy everything in `/dist` folder to `gh-pages` branch and push it to github, just run:

```
$ grunt ship
```
Please do not touch `gh-pages` branch manually

### Problem with CoffeeScript Grunt Module

Run this npm command to fix it: 


```
$ npm run fix-coffee
```

We need to update grunt-contrib-coffee's coffee-script version to `1.6.0` and run `npm install` it if you see coffee-script errors.


### Contributing
Please use Gihub bug tracker for reporting bugs or pull requests.
