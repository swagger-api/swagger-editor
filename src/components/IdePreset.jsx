import React from 'react';
import SwaggerUI from 'swagger-ui-react';

import layoutDefaultPreset from '../plugins/layout-default/index.js';
import monacoEditorPlugin from '../plugins/monaco/index.js';
import topbarPlugin from '../plugins/topbar/index.js';
import asyncApiLayoutPreset from '../plugins/asyncapi-react/index.js';

const ide = (
  <SwaggerUI
    presets={[layoutDefaultPreset, monacoEditorPlugin, topbarPlugin, asyncApiLayoutPreset]}
    layout="LayoutDefault" // prev, StandaloneLayout
    // url="https://petstore.swagger.io/v2/swagger.json"
    // url="https://petstore3.swagger.io/api/v3/openapi.yaml"
    url="https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml"
    // url="https://gist.githubusercontent.com/ponelat/2bbf3befb363818451a51417dcbccb1a/raw/43bbb1b4f69d96c3615c7d8ee891a9d6ad17f051/asyncapi.yml"
  />
);

export default ide;
