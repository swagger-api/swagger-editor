import React from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import './styles/main.scss';
import LayoutPlugin from './plugins/layout/index.js';
import SplashScreenPlugin from './plugins/splash-screen/index.js';
import TopBarPlugin from './plugins/top-bar/index.js';
import ModalsPlugin from './plugins/modals/index.js';
import DialogsPlugin from './plugins/dialogs/index.js';
import DropdownMenuPlugin from './plugins/dropdown-menu/index.js';
import DropzonePlugin from './plugins/dropzone/index.js';
import VersionsPlugin from './plugins/versions/index.js';
import EditorTextareaPlugin from './plugins/editor-textarea/index.js';
import EditorMonacoPlugin from './plugins/editor-monaco/index.js';
import EditorPreviewPlugin from './plugins/editor-preview/index.js';
import EditorPreviewSwaggerUIPlugin from './plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from './plugins/editor-preview-asyncapi/index.js';
import EditorContentReadOnlyPlugin from './plugins/editor-content-read-only/index.js';
import EditorContentOriginPlugin from './plugins/editor-content-origin/index.js';
import EditorContentTypePlugin from './plugins/editor-content-type/index.js';
import EditorContentPersistencePlugin from './plugins/editor-content-persistence/index.js';
import EditorContentFixturesPlugin from './plugins/editor-content-fixtures/index.js';

const SafeRenderPlugin = (system) =>
  SwaggerUI.plugins.SafeRender({
    componentList: [
      'TopBar',
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
  DropdownMenu: DropdownMenuPlugin,
  Dropzone: DropzonePlugin,
  Versions: VersionsPlugin,
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorContentReadOnly: EditorContentReadOnlyPlugin,
  EditorContentOrigin: EditorContentOriginPlugin,
  EditorContentType: EditorContentTypePlugin,
  EditorContentPersistence: EditorContentPersistencePlugin,
  EditorContentFixtures: EditorContentFixturesPlugin,
  EditorPreview: EditorPreviewPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  TopBar: TopBarPlugin,
  SplashScreenPlugin,
  Layout: LayoutPlugin,
};
SwaggerEditor.presets = {
  textarea: () => [
    ModalsPlugin,
    DialogsPlugin,
    DropdownMenuPlugin,
    DropzonePlugin,
    VersionsPlugin,
    EditorTextareaPlugin,
    EditorContentReadOnlyPlugin,
    EditorContentOriginPlugin,
    EditorContentTypePlugin,
    EditorContentPersistencePlugin,
    EditorContentFixturesPlugin,
    EditorPreviewPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopBarPlugin,
    SplashScreenPlugin,
    LayoutPlugin,
    SafeRenderPlugin,
  ],
  monaco: () => [
    ModalsPlugin,
    DialogsPlugin,
    DropdownMenuPlugin,
    DropzonePlugin,
    VersionsPlugin,
    EditorTextareaPlugin,
    EditorMonacoPlugin,
    EditorContentReadOnlyPlugin,
    EditorContentOriginPlugin,
    EditorContentTypePlugin,
    EditorContentPersistencePlugin,
    EditorContentFixturesPlugin,
    EditorPreviewPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopBarPlugin,
    SplashScreenPlugin,
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
