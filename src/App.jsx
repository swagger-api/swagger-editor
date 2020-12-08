import React, { PureComponent } from 'react';
import SwaggerUI from 'swagger-ui-react';

import GenericEditorPlugin from './plugins/generic-editor';
import SwaggerEditorStandalonePreset from './plugins/standalone';

const editor = (
  <SwaggerUI
    presets={[SwaggerEditorStandalonePreset, GenericEditorPlugin]}
    layout="StandaloneLayout"
    url="https://petstore.swagger.io/v2/swagger.json"
  />
);

export default class App extends PureComponent {
  render() {
    return editor;
  }
}
