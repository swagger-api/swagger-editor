import React from 'react';
import 'swagger-ui-react/swagger-ui.css';
import deepmerge from 'deepmerge';
import SwaggerUI from 'swagger-ui-react';

import './components/_all.scss';
import layoutDefaultPlugin from './plugins/layout-default/index.js';
import monacoPlugin from './plugins/monaco/index.js';
import topbarPlugin from './plugins/topbar/index.js';
import asyncApiPlugin from './plugins/asyncapi-react/index.js';

const SwaggerIDE = React.memo((props = {}) => {
  const mergedProps = deepmerge(SwaggerIDE.defaultProps, props);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <SwaggerUI {...mergedProps} />;
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
