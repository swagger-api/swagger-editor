# Development Guide

### Installing dependencies
This app have npm and Bower dependencies. To install all dependencies in one line, run
```shell
npm i; bower i
```

### Running
Simply run
```shell
grunt serve
```

For development it's preferred to have `grunt` installed globally on your machine.  

### Building
To build the project just run: 

```
$ grunt build
```
This will build a new version of the web app, ready for production in `/dist` folder

###  Configuration
#### Default settings file
Swagger Editor will make an XHR GET call to `/config/defaults.json` to get it's settings before launching the app. If you are using Swagger Editor as a dependency, you can provide your own `defaults.json` at this endpoint to override default settings.
See [./config.rst](./config.rst) and [defaults.guide.js](./app/config/defaults.json.guide.js)

#### CORS

If you want to import YAML or JSON resources from other hosts, those resources should
be served as [CORS-enabled resources](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

For example, if you get an error such as
```
{"data":"","status":0,"config":{"method":"GET","transformRequest":[null],"transformResponse":
[null],"url":"http://www.example.com/swagger/apis/swagger.json","headers":{"accept":
"application/x-yaml,text/yaml,application/json,*/*"}}}
```
this indicates the resource is not CORS-enabled.
See [./cors.rst](./cors.rst) for how to enable CORS.

### Running with Docker
If you are familiar with [Docker](https://www.docker.com/), a `Dockerfile` is
provided.

Build an image named `swagger-editor`
```
sudo docker build -t swagger-editor .
```

Run the container, using the local port 8080 (you may change this to any available
port).
```
sudo docker run -ti -p 8080:80 swagger-editor
```
And open [http://localhost:8080](http://localhost:8080) in your browser

### Code Style
Code style is enforced by [JSCS (JavaScript Code Style)](https://github.com/jscs-dev/node-jscs) and [JSHint](http://jshint.com/). Build will fail if changes in code is not following code style guildlines. 

### Testing
To run all tests run 

```shell
npm test
```

This will build and run unit tests then if it was successful, it will run  end-to-end tests.

#### Unit tests
All unit tests are located in [`../test/unit`](../test/unit). Unit tests are written in Jasmine and run by Karma. To run unit tests, run

```shell
grunt karma:unit
```

For developing unit tests, run 
```shell
grunt test-dev
```
This will keep test browser and test watcher open and watches for file changes to re-run tests.

#### End-to-end tests
All end-to-end tests are located in [`../test/e2e`](../test/e2e). To run end-to-end test, run

```shell
grunt protr
```
This will run [Protractor](http://angular.github.io/protractor/#/) end-to-end test.
