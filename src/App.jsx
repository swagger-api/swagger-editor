import React, { useEffect, createRef } from 'react';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';
import ReactModal from 'react-modal';
import 'swagger-ui-react/swagger-ui.css';

import './components/_all.scss';
import layoutDefaultPlugin from './plugins/layout-default/index.js';
import monacoPlugin from './plugins/monaco/index.js';
import topbarPlugin from './plugins/topbar/index.js';
import asyncApiPlugin from './plugins/asyncapi-react/index.js';

const SwaggerIDE = React.memo((props = {}) => {
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

SwaggerIDE.presets = {
  default: () => [layoutDefaultPlugin, monacoPlugin, topbarPlugin, asyncApiPlugin],
};

SwaggerIDE.propTypes = SwaggerUI.propTypes;

SwaggerIDE.defaultProps = {
  ...SwaggerUI.defaultProps,
  layout: 'LayoutDefault',
  presets: [SwaggerIDE.presets.default],
  url: 'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
};

export default SwaggerIDE;
