import { Root } from 'react-dom/client';

import { SwaggerEditorType } from './swagger-editor';

declare global {
  var root: Root;
  var SwaggerEditor: SwaggerEditorType;
}

export {};
