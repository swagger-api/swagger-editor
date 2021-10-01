import React, { PureComponent } from 'react';
import SwaggerUI from 'swagger-ui-react';

import layoutDefaultPreset from './plugins/layout-default';
import monacoEditorPlugin from './plugins/monaco';
import topbarPlugin from './plugins/topbar';

const editor = (
  <SwaggerUI
    presets={[layoutDefaultPreset, monacoEditorPlugin, topbarPlugin]}
    layout="LayoutDefault" // prev, StandaloneLayout
    // url="https://petstore.swagger.io/v2/swagger.json"
    url="https://petstore3.swagger.io/api/v3/openapi.yaml"
  />
);

export default class App extends PureComponent {
  render() {
    return editor;
  }
}
