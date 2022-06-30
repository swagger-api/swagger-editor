import React from 'react';
import ReactDOM from 'react-dom';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App.jsx';

const defaultUrlAsyncApi =
  'https://raw.githubusercontent.com/asyncapi/spec/v2.4.0/examples/streetlights-kafka.yml';
// const defaultUrlOas3 = 'https://petstore3.swagger.io/api/v3/openapi.json';

let initialUrl;

if (process.env.REACT_APP_SWAGGER_URL) {
  // remote url
  initialUrl = `${process.env.PUBLIC_URL}${process.env.REACT_APP_SWAGGER_URL}`;
} else if (process.env.REACT_APP_SWAGGER_FILE) {
  // local file within `{root}/public`
  // env flag also should include `/static` directory, e.g. `/static/petstore-oas3.yml`
  initialUrl = `${process.env.PUBLIC_URL}${process.env.REACT_APP_SWAGGER_FILE}`;
} else {
  initialUrl = defaultUrlAsyncApi;
}

ReactDOM.render(<SwaggerEditor url={initialUrl} />, document.getElementById('swagger-editor'));
