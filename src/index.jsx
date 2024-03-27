import React from 'react';
import { createRoot } from 'react-dom/client';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App.jsx';

const url = process.env.REACT_APP_DEFINITION_FILE
  ? `${process.env.PUBLIC_URL}${process.env.REACT_APP_DEFINITION_FILE}`
  : process.env.REACT_APP_DEFINITION_URL;

const root = createRoot(document.getElementById('swagger-editor'));
root.render(<SwaggerEditor url={url} />);
