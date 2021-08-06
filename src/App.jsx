import React, { PureComponent } from 'react';
import SwaggerUI from 'swagger-ui-react';

import GenericEditorPreset from './plugins/generic-editor';
import SwaggerEditorStandalonePreset from './plugins/standalone';

const editor = (
  <SwaggerUI
    presets={[SwaggerEditorStandalonePreset, GenericEditorPreset]}
    layout="StandaloneLayout"
    // url="https://petstore.swagger.io/v2/swagger.json"
    url="https://petstore3.swagger.io/api/v3/openapi.yaml"
  />
);

export default class App extends PureComponent {
  render() {
    return editor;
  }
}
