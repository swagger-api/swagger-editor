/* eslint-disable */
import SwaggerUI from 'swagger-ui';
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset';
import 'swagger-ui/dist/swagger-ui.css';

import SwaggerEditor from './App.jsx';

globalThis.addEventListener('load', () => {
  SwaggerUI({
    url: 'https://petstore.swagger.io/v2/swagger.json',
    dom_id: '#swagger-editor',
    presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
    plugins: [
      SwaggerEditor.plugins.EditorContentType,
      SwaggerEditor.plugins.EditorPreviewAsyncAPI,
      SwaggerEditor.plugins.EditorPreviewAPIDesignSystems,
      SwaggerEditor.plugins.SwaggerUIAdapter,
      SwaggerUI.plugins.DownloadUrl,
    ],
    layout: 'StandaloneLayout',
  });
});

// const url = process.env.REACT_APP_DEFINITION_FILE
//   ? `${process.env.PUBLIC_URL}${process.env.REACT_APP_DEFINITION_FILE}`
//   : process.env.REACT_APP_DEFINITION_URL;
//
// ReactDOM.render(<SwaggerEditor url={url} />, document.getElementById('swagger-editor'));
