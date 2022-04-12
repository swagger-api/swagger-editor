import React from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import './styles/main.scss';
import LayoutPlugin from './plugins/layout/index.js';
import TopbarPlugin from './plugins/topbar/index.js';
import ModalsPlugin from './plugins/modals/index.js';
import DialogsPlugin from './plugins/dialogs/index.js';
import DropzonePlugin from './plugins/dropzone/index.js';
import EditorTextareaPlugin from './plugins/editor-textarea/index.js';
import EditorMonacoPlugin from './plugins/editor-monaco/index.js';
import EditorPreviewSwaggerUIPlugin from './plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from './plugins/editor-preview-asyncapi/index.js';
import EditorReadOnlyPlugin from './plugins/editor-read-only/index.js';
import EditorSpecOriginPlugin from './plugins/editor-spec-origin/index.js';
import EditorLocalStoragePlugin from './plugins/editor-local-storage/index.js';

const SafeRenderPlugin = (system) =>
  SwaggerUI.plugins.SafeRender({
    componentList: [
      'Topbar',
      'SwaggerIDELayout',
      'Editor',
      'EditorTextarea',
      'EditorMonaco',
      'EditorPane',
      'EditorPaneBarTop',
      'EditorPreviewPane',
      'ValidationPane',
      'AlertDialog',
      'ConfirmDialog',
      'Dropzone',
    ],
  })(system);

const SwaggerIDE = React.memo((props) => {
  const mergedProps = deepmerge(SwaggerIDE.defaultProps, props);

  return (
    <div className="swagger-ide">
      <SwaggerUI {...mergedProps} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
    </div>
  );
});

SwaggerIDE.plugins = {
  Modals: ModalsPlugin,
  Dialogs: DialogsPlugin,
  Dropzone: DropzonePlugin,
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorReadOnly: EditorReadOnlyPlugin,
  EditorSpecOrigin: EditorSpecOriginPlugin,
  EditorLocalStorage: EditorLocalStoragePlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  Topbar: TopbarPlugin,
  Layout: LayoutPlugin,
};
SwaggerIDE.presets = {
  textarea: () => [
    ModalsPlugin,
    DialogsPlugin,
    DropzonePlugin,
    EditorTextareaPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
    EditorLocalStoragePlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopbarPlugin,
    LayoutPlugin,
    SafeRenderPlugin,
  ],
  monaco: () => [
    ModalsPlugin,
    DialogsPlugin,
    DropzonePlugin,
    EditorTextareaPlugin,
    EditorMonacoPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
    EditorLocalStoragePlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopbarPlugin,
    LayoutPlugin,
    SafeRenderPlugin,
  ],
  default: (...args) => SwaggerIDE.presets.monaco(...args),
};

SwaggerIDE.propTypes = SwaggerUI.propTypes;

SwaggerIDE.defaultProps = {
  ...SwaggerUI.defaultProps,
  layout: 'SwaggerIDELayout',
  presets: [SwaggerIDE.presets.default],
};

export default SwaggerIDE;
