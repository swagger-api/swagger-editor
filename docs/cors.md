# HTTP access control (CORS) issues

Swagger Editor is a web application and by its nature is limited to [HTTP access control policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS). If you can't make calls using **Try this operation** component of the editor it's very likely because the server is not allowing the `editor.swagger.io` domain to make [`XHR`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (also known as AJAX) calls to it.

## How to fix CORS issues

There are multiple ways of fixing the CORS issue in Swagger Editor. You can modify your server if you own it or run Swagger Editor in an environment that ignores HTTP access control policy.

### Enable CORS in your server

To enable CORS in your server you need to add following headers to your HTTP responses


```
Access-Control-Allow-Origin: editor.swagger.io
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
```

Note that `Access-Control-Allow-Origin` accepts a regular expression. You can put `*` for its value to allow CORS calls from any domain(origin).

### Host Swagger Editor in your own domain 

If you don't want to add CORS headers to your server, the other option is to host Swagger Editor in your own domain. When Swagger Editor is running in the same domain as the API it's editing, it can make calls to your domain with no restriction. Run the following commands to generate a new build of Swagger Editor and serve the `dist` folder statically in your domain.

When an XHR call is not cross-domain, JavaScript will see all the headers. If you want to see more accurate response, this method is preferred.

```
git clone https://github.com/swagger-api/swagger-editor.git
cd swagger-editor
npm run build

# now dist folder have a fresh build of Swagger Editor
```

### Proxy calls using a third party server

You can make calls using a proxy to enable CORS for your API. Many API management providers provide proxies for enabling CORS. You can also run your own proxy. For example you can use [cors-it](https://github.com/mohsen1/cors-it) proxy if you're using Node.js.

### Run Swagger Editor in a browser that ignores HTTP access control

Browsers have HTTP access control enabled by default but you can disable it in the setting.

##### Chrome
To run Chrome with HTTP access control disabled use  `--disable-web-security` flag.

For example in OSX you need to run the following command:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir
```
