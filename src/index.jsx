import React from 'react';
import ReactDOM from 'react-dom';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App.jsx';

const url = process.env.REACT_APP_DEFINITION_FILE
  ? `${process.env.PUBLIC_URL}${process.env.REACT_APP_DEFINITION_FILE}`
  : process.env.REACT_APP_DEFINITION_URL;

ReactDOM.render(<SwaggerEditor url={url} />, document.getElementById('swagger-editor'));
