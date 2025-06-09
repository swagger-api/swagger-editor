import React from 'react';
import { Preset, SwaggerUIProps } from 'swagger-ui-react';

interface SwaggerEditorPlugins {
  plugins?: {
    [key: string]: Preset;
  };
}

interface SwaggerEditorPresets {
  presets?: {
    [key: string]: Preset;
  };
}

export type SwaggerEditorType = React.NamedExoticComponent<SwaggerUIProps> &
  SwaggerEditorPresets &
  SwaggerEditorPlugins;
