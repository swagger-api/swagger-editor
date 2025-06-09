import { Root } from 'react-dom/client.ts';

import { SwaggerEditorType } from './swagger-editor.ts';

declare global {
  var root: Root;
  var SwaggerEditor: SwaggerEditorType;
}

export {};
