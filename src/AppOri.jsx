import React, { PureComponent } from 'react';
import SwaggerUI from 'swagger-ui-react';

import GenericEditorPlugin from './plugin';
import './index.scss';

// note, a swagger-ui warning plugins[0] expected object, not a func
const editor = (
  <SwaggerUI
    plugins={[GenericEditorPlugin]}
    layout="GenericEditorLayout"
    url="https://petstore.swagger.io/v2/swagger.json"
  />
);

export default class App extends PureComponent {
  render() {
    return editor;
  }
}
