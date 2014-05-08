# Project Phonics

Coming soon!


## [View App](http://apigee.github.io/phonics/)

## Running Locally

* Make sure you have NodeJS installed
* Clone the repository
* `npm install`
* `bower install`
* `grunt serve`



## Building

Just run 

```
$ grunt build

```


## Pushing to `gh-page`

Just run 

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
