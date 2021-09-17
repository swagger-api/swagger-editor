# ApiDOM editor home

App will load with Monaco, Topbar, Swagger-UI (react).

refer to `CHANGELOG.md` for migration & project status

refer `docs/swagger-client.md` for some notes

Webpack and development setup based on Create React App (ejected)

## Install

After cloning run the following commands to init and update `apidom` submodule

```
git submodule init
git submodule update
```

- (To update apidom submodule to latest commit, issue `git submodule update --recursive --remote`)  

Change directory to `apidom` monorepo and run following commands:

```sh
 $ npm i
 $ npm run build
```

Now change to root directory and run the following commands  

```shell script
 $ npm i
 $ npm start
```

Edit files in `./src` directory  

The default development port is `port=3000`. If a port is already in use, `npm start` will increment the port.  

## Test

Both Jest and Cypress include `@testing-library` plugin support.  

**Jest Unit Tests**
```sh
 $ npm test
```

**Cypress E2E Tests**


*Option 1a:* 
* `.env.development`  
* two terminal windows  
* Cypress headless mode  
* Cypress port=3000  
* Useful for quickly running Cypress tests while in development mode  

```sh
 $ npm start # terminal 1
 $ npm run test:cy:run # terminal 2
```

*Option 1b:*  
* `.env.development`  
* two terminal windows  
* Cypress interactive mode  
* Cypress port=3000  
* Useful for updating Cypress test(s) while already in development mode  

```sh
 $ npm start # terminal 1
 $ npm run test:cy:open # terminal 2
```

*Option 2a:*  
* `.env.test`  
* single terminal window  
* Cypress interactive mode  
* Cypress port=3260  
* Useful for working on adding/updating Cypress tests independent of development in `./src`  

```sh
 $ npm run test:cy:dev
```

*Option 2b:*  
* `.env.test`  
* single terminal window  
* Cypress headless mode  
* Cypress port=3260  
* Useful settings and environment variables appropriate for CI

```sh
 $ npm run test:cy:ci
```

## build
This script will build and serve a gzipped static build at `localhost:3050`.  

```sh
$ npm run build
$ npm run serve-static-build
```
