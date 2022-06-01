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
import EditorPersistencePlugin from './plugins/editor-persistence/index.js';

const SafeRenderPlugin = (system) =>
  SwaggerUI.plugins.SafeRender({
    componentList: [
      'Topbar',
      'SwaggerEditorLayout',
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

const SwaggerEditor = React.memo((props) => {
  const mergedProps = deepmerge(SwaggerEditor.defaultProps, props);

  return (
    <div className="swagger-editor">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <SwaggerUI {...mergedProps} />
    </div>
  );
});

SwaggerEditor.plugins = {
  Modals: ModalsPlugin,
  Dialogs: DialogsPlugin,
  Dropzone: DropzonePlugin,
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorReadOnly: EditorReadOnlyPlugin,
  EditorSpecOrigin: EditorSpecOriginPlugin,
  EditorPersistence: EditorPersistencePlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  Topbar: TopbarPlugin,
  Layout: LayoutPlugin,
};
SwaggerEditor.presets = {
  textarea: () => [
    ModalsPlugin,
    DialogsPlugin,
    DropzonePlugin,
    EditorTextareaPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
    EditorPersistencePlugin,
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
    EditorPersistencePlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopbarPlugin,
    LayoutPlugin,
    SafeRenderPlugin,
  ],
  default: (...args) => SwaggerEditor.presets.monaco(...args),
};

SwaggerEditor.propTypes = SwaggerUI.propTypes;

SwaggerEditor.defaultProps = {
  ...SwaggerUI.defaultProps,
  layout: 'SwaggerEditorLayout',
  presets: [SwaggerEditor.presets.default],
};

export default SwaggerEditor;
