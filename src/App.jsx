import React from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import './styles/main.scss';
import LayoutPlugin from './plugins/layout/index.js';
import TopbarPlugin from './plugins/topbar/index.js';
import EditorTextareaPlugin from './plugins/editor-textarea/index.js';
import EditorMonacoPlugin from './plugins/editor-monaco/index.js';
import EditorPreviewSwaggerUIPlugin from './plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from './plugins/editor-preview-asyncapi/index.js';
import EditorReadOnlyPlugin from './plugins/editor-read-only/index.js';
import EditorSpecOriginPlugin from './plugins/editor-spec-origin/index.js';

const SwaggerIDE = React.memo((props) => {
  const mergedProps = deepmerge(SwaggerIDE.defaultProps, props);

  return (
    <div className="swagger-ide">
      <SwaggerUI {...mergedProps} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
    </div>
  );
});

SwaggerIDE.plugins = {
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
  EditorReadOnly: EditorReadOnlyPlugin,
  EditorSpecOrigin: EditorSpecOriginPlugin,
  Topbar: TopbarPlugin,
  Layout: LayoutPlugin,
};
SwaggerIDE.presets = {
  textarea: () => [
    EditorTextareaPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    TopbarPlugin,
    LayoutPlugin,
  ],
  monaco: () => [
    EditorMonacoPlugin,
    EditorPreviewSwaggerUIPlugin,
    EditorPreviewAsyncAPIPlugin,
    EditorReadOnlyPlugin,
    EditorSpecOriginPlugin,
    TopbarPlugin,
    LayoutPlugin,
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
