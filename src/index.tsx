import React from 'react';
import { createRoot } from 'react-dom/client';
import 'swagger-ui-react/swagger-ui.css';

import SwaggerEditor from './App.tsx';

const root = createRoot(document.getElementById('swagger-editor') as HTMLElement);

if (process.env.REACT_APP_E2E_TESTS) {
  globalThis.React = React;
  globalThis.root = root;
  globalThis.SwaggerEditor = SwaggerEditor;
} else {
  root.render(<SwaggerEditor queryConfigEnabled />);
}
