import React from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import './styles/main.scss';
import LayoutPlugin from './plugins/layout/index.js';
import TopbarPlugin from './plugins/topbar/index.js';
import ModalsPlugin from './plugins/modals/index.js';
import DialogsPlugin from './plugins/dialogs/index.js';
import EditorTextareaPlugin from './plugins/editor-textarea/index.js';
import EditorMonacoPlugin from './plugins/editor-monaco/index.js';
import EditorPreviewSwaggerUIPlugin from './plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from './plugins/editor-preview-asyncapi/index.js';
import EditorReadOnlyPlugin from './plugins/editor-read-only/index.js';
import EditorSpecOriginPlugin from './plugins/editor-spec-origin/index.js';

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
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorReadOnly: EditorReadOnlyPlugin,
  EditorSpecOrigin: EditorSpecOriginPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  Topbar: TopbarPlugin,
  Layout: LayoutPlugin,
};
SwaggerIDE.presets = {
  textarea: () => [
    ModalsPlugin,
    DialogsPlugin,
    EditorTextareaPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopbarPlugin,
    LayoutPlugin,
    SafeRenderPlugin,
  ],
  monaco: () => [
    ModalsPlugin,
    DialogsPlugin,
    EditorTextareaPlugin,
    EditorMonacoPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
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
