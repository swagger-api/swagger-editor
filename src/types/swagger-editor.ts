import React from 'react';
import { Preset, SwaggerUIProps, Plugin } from 'swagger-ui-react';

enum presetNames {
  textarea = 'textarea',
  monaco = 'monaco',
  default = 'default',
}

enum pluginNames {
  Util = 'Util',
  Modals = 'Modals',
  Dialogs = 'Dialogs',
  DropdownMenu = 'DropdownMenu',
  Dropzone = 'Dropzone',
  Versions = 'Versions',
  EditorTextarea = 'EditorTextarea',
  EditorMonaco = 'EditorMonaco',
  EditorMonacoLanguageApiDOM = 'EditorMonacoLanguageApiDOM',
  EditorMonacoYamlPaste = 'EditorMonacoYamlPaste',
  EditorContentReadOnly = 'EditorContentReadOnly',
  EditorContentOrigin = 'EditorContentOrigin',
  EditorContentType = 'EditorContentType',
  EditorContentPersistence = 'EditorContentPersistence',
  EditorContentFixtures = 'EditorContentFixtures',
  EditorContentFromFile = 'EditorContentFromFile',
  EditorPreview = 'EditorPreview',
  EditorPreviewSwaggerUI = 'EditorPreviewSwaggerUI',
  EditorPreviewAsyncAPI = 'EditorPreviewAsyncAPI',
  EditorPreviewApiDesignSystems = 'EditorPreviewApiDesignSystems',
  EditorSafeRender = 'EditorSafeRender',
  TopBar = 'TopBar',
  SplashScreenPlugin = 'SplashScreenPlugin',
  Layout = 'Layout',
  SwaggerUIAdapter = 'SwaggerUIAdapter',
}

interface SwaggerEditorPlugins {
  plugins?: {
    [key in pluginNames]: Plugin;
  };
}

interface SwaggerEditorPresets {
  presets?: {
    [key in presetNames]: Preset;
  };
}

export type SwaggerEditorType = React.NamedExoticComponent<SwaggerUIProps> &
  SwaggerEditorPresets &
  SwaggerEditorPlugins;
