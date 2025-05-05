import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import isPlainObject from 'lodash/isPlainObject.js';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
/**
 * Plugins
 */
import LayoutPlugin from 'plugins/layout/index.js';
import SplashScreenPlugin from 'plugins/splash-screen/index.js';
import TopBarPlugin from 'plugins/top-bar/index.js';
import ModalsPlugin from 'plugins/modals/index.js';
import DialogsPlugin from 'plugins/dialogs/index.js';
import DropdownMenuPlugin from 'plugins/dropdown-menu/index.js';
import DropzonePlugin from 'plugins/dropzone/index.js';
import VersionsPlugin from 'plugins/versions/index.js';
import EditorTextareaPlugin from 'plugins/editor-textarea/index.js';
import EditorMonacoPlugin from 'plugins/editor-monaco/index.js';
import EditorMonacoLanguageApiDOMPlugin from 'plugins/editor-monaco-language-apidom/index.js';
import EditorMonacoYamlPastePlugin from 'plugins/editor-monaco-yaml-paste/index.js';
import EditorPreviewPlugin from 'plugins/editor-preview/index.js';
import EditorPreviewSwaggerUIPlugin from 'plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from 'plugins/editor-preview-asyncapi/index.js';
import EditorPreviewApiDesignSystemsPlugin from 'plugins/editor-preview-api-design-systems/index.js';
import EditorContentReadOnlyPlugin from 'plugins/editor-content-read-only/index.js';
import EditorContentOriginPlugin from 'plugins/editor-content-origin/index.js';
import EditorContentTypePlugin from 'plugins/editor-content-type/index.js';
import EditorContentPersistencePlugin from 'plugins/editor-content-persistence/index.js';
import EditorContentFixturesPlugin from 'plugins/editor-content-fixtures/index.js';
import EditorContentFromFilePlugin from 'plugins/editor-content-from-file/index.js';
import EditorSafeRenderPlugin from 'plugins/editor-safe-render/index.js';
import SwaggerUIAdapterPlugin from 'plugins/swagger-ui-adapter/index.js';
import PropsChangeWatcherPlugin from 'plugins/props-change-watcher/index.js';
import UtilPlugin from 'plugins/util/index.js';
/**
 * Presets
 */
import TextareaPreset from 'presets/textarea/index.js';
import MonacoPreset from 'presets/monaco/index.js';

import './styles/main.scss';

const SwaggerEditor = React.memo(
  ({
    spec = SwaggerUI.config.defaults.spec,
    url = SwaggerUI.config.defaults.url,
    layout = 'SwaggerEditorLayout',
    requestInterceptor = SwaggerUI.config.defaults.requestInterceptor,
    responseInterceptor = SwaggerUI.config.defaults.responseInterceptor,
    supportedSubmitMethods = SwaggerUI.config.defaults.supportedSubmitMethods,
    queryConfigEnabled = SwaggerUI.config.defaults.queryConfigEnabled,
    plugins = [...SwaggerUI.config.defaults.plugins],
    displayOperationId = SwaggerUI.config.defaults.displayOperationId,
    showMutatedRequest = SwaggerUI.config.defaults.showMutatedRequest,
    docExpansion = SwaggerUI.config.defaults.docExpansion,
    defaultModelExpandDepth = SwaggerUI.config.defaults.defaultModelExpandDepth,
    defaultModelsExpandDepth = SwaggerUI.config.defaults.defaultModelsExpandDepth,
    defaultModelRendering = SwaggerUI.config.defaults.defaultModelRendering,
    presets = [SwaggerEditor.presets.default],
    deepLinking = SwaggerUI.config.defaults.deepLinking,
    showExtensions = true,
    showCommonExtensions = SwaggerUI.config.defaults.showCommonExtensions,
    filter = SwaggerUI.config.defaults.filter,
    requestSnippetsEnabled = SwaggerUI.config.defaults.requestSnippetsEnabled,
    requestSnippets = SwaggerUI.config.defaults.requestSnippets,
    tryItOutEnabled = SwaggerUI.config.defaults.tryItOutEnabled,
    displayRequestDuration = SwaggerUI.config.defaults.displayRequestDuration,
    withCredentials = SwaggerUI.config.defaults.withCredentials,
    persistAuthorization = SwaggerUI.config.defaults.persistAuthorization,
    oauth2RedirectUrl = SwaggerUI.config.defaults.oauth2RedirectUrl,
    initialState = SwaggerUI.config.defaults.initialState,
    onComplete = null,
  }) => {
    const { plugin: propsChangeWatcherPlugin, getSystem } =
      PropsChangeWatcherPlugin.useMountPlugin();
    const specStr = useMemo(() => {
      if (spec !== SwaggerUI.config.defaults.spec && isPlainObject(spec)) {
        return JSON.stringify(spec, null, 2);
      }
      return spec;
    }, [spec]);

    PropsChangeWatcherPlugin.usePropChange(spec, (newValue, oldValue) => {
      getSystem()?.editorActions?.propChanged('spec', newValue, oldValue);
    });
    PropsChangeWatcherPlugin.usePropChange(url, (newValue, oldValue) => {
      getSystem()?.editorActions?.propChanged('url', newValue, oldValue);
    });

    return (
      <div className="swagger-editor">
        <SwaggerUI
          spec={specStr}
          url={url}
          layout={layout}
          requestInterceptor={requestInterceptor}
          responseInterceptor={responseInterceptor}
          supportedSubmitMethods={supportedSubmitMethods}
          queryConfigEnabled={queryConfigEnabled}
          plugins={[propsChangeWatcherPlugin, ...plugins]}
          displayOperationId={displayOperationId}
          showMutatedRequest={showMutatedRequest}
          docExpansion={docExpansion}
          defaultModelExpandDepth={defaultModelExpandDepth}
          defaultModelsExpandDepth={defaultModelsExpandDepth}
          defaultModelRendering={defaultModelRendering}
          presets={presets}
          deepLinking={deepLinking}
          showExtensions={showExtensions}
          showCommonExtensions={showCommonExtensions}
          filter={filter}
          requestSnippetsEnabled={requestSnippetsEnabled}
          requestSnippets={requestSnippets}
          tryItOutEnabled={tryItOutEnabled}
          displayRequestDuration={displayRequestDuration}
          withCredentials={withCredentials}
          persistAuthorization={persistAuthorization}
          oauth2RedirectUrl={oauth2RedirectUrl}
          initialState={initialState}
          onComplete={onComplete}
        />
      </div>
    );
  }
);

/* eslint-disable react/require-default-props */
SwaggerEditor.propTypes = {
  spec: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  url: PropTypes.string,
  layout: PropTypes.string,
  requestInterceptor: PropTypes.func,
  responseInterceptor: PropTypes.func,
  onComplete: PropTypes.func,
  docExpansion: PropTypes.oneOf(['list', 'full', 'none']),
  supportedSubmitMethods: PropTypes.arrayOf(
    PropTypes.oneOf(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'])
  ),
  queryConfigEnabled: PropTypes.bool,
  plugins: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.func),
    PropTypes.func,
  ]),
  displayOperationId: PropTypes.bool,
  showMutatedRequest: PropTypes.bool,
  defaultModelExpandDepth: PropTypes.number,
  defaultModelsExpandDepth: PropTypes.number,
  defaultModelRendering: PropTypes.oneOf(['example', 'model']),
  presets: PropTypes.arrayOf(PropTypes.func),
  deepLinking: PropTypes.bool,
  showExtensions: PropTypes.bool,
  showCommonExtensions: PropTypes.bool,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  requestSnippetsEnabled: PropTypes.bool,
  requestSnippets: PropTypes.shape(),
  tryItOutEnabled: PropTypes.bool,
  displayRequestDuration: PropTypes.bool,
  persistAuthorization: PropTypes.bool,
  withCredentials: PropTypes.bool,
  oauth2RedirectUrl: PropTypes.string,
  initialState: PropTypes.shape(),
};
/* eslint-enable */

SwaggerEditor.plugins = {
  Util: UtilPlugin,
  Modals: ModalsPlugin,
  Dialogs: DialogsPlugin,
  DropdownMenu: DropdownMenuPlugin,
  Dropzone: DropzonePlugin,
  Versions: VersionsPlugin,
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorMonacoLanguageApiDOM: EditorMonacoLanguageApiDOMPlugin,
  EditorMonacoYamlPaste: EditorMonacoYamlPastePlugin,
  EditorContentReadOnly: EditorContentReadOnlyPlugin,
  EditorContentOrigin: EditorContentOriginPlugin,
  EditorContentType: EditorContentTypePlugin,
  EditorContentPersistence: EditorContentPersistencePlugin,
  EditorContentFixtures: EditorContentFixturesPlugin,
  EditorContentFromFile: EditorContentFromFilePlugin,
  EditorPreview: EditorPreviewPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  EditorPreviewApiDesignSystems: EditorPreviewApiDesignSystemsPlugin,
  EditorSafeRender: EditorSafeRenderPlugin,
  TopBar: TopBarPlugin,
  SplashScreenPlugin,
  Layout: LayoutPlugin,
  SwaggerUIAdapter: SwaggerUIAdapterPlugin,
};

SwaggerEditor.presets = {
  textarea: TextareaPreset,
  monaco: MonacoPreset,
  default: MonacoPreset,
};

export default SwaggerEditor;
