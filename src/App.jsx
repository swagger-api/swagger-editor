import React, { useEffect, createRef } from 'react';
import deepmerge from 'deepmerge';
import ReactModal from 'react-modal';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import './styles/main.scss';
import LayoutPlugin from './plugins/layout/index.js';
import TopbarPlugin from './plugins/topbar/index.js';
import EditorTextareaPlugin from './plugins/editor-textarea/index.js';
import EditorMonacoPlugin from './plugins/editor-monaco/index.js';
import EditorPreviewSwaggerUIPlugin from './plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from './plugins/editor-preview-asyncapi/index.js';

const SwaggerIDE = React.memo((props) => {
  const mergedProps = deepmerge(SwaggerIDE.defaultProps, props);
  const element = createRef();

  useEffect(() => {
    ReactModal.setAppElement(element.current);
    return () => ReactModal.setAppElement(null);
  });

  return (
    <div className="swagger-ide" ref={element}>
      <SwaggerUI {...mergedProps} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
    </div>
  );
});

SwaggerIDE.plugins = {
  EditorTextarea: EditorTextareaPlugin,
  EditorMonaco: EditorMonacoPlugin,
  EditorPreviewSwaggerUI: EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPI: EditorPreviewAsyncAPIPlugin,
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
