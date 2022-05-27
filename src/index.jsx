import React from 'react';
import ReactDOM from 'react-dom';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App.jsx';

ReactDOM.render(
  <SwaggerEditor url="https://raw.githubusercontent.com/asyncapi/spec/v2.4.0/examples/streetlights-kafka.yml" />,
  document.getElementById('swagger-editor')
);
