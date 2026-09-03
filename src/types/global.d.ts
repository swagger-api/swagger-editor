import { Root } from 'react-dom/client';

import { SwaggerEditorType } from './swagger-editor';

declare global {
  var root: Root;
  var SwaggerEditor: SwaggerEditorType;
  const PACKAGE_VERSION: string;
}

export {};
