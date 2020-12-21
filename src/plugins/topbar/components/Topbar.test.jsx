import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SwaggerUI from 'swagger-ui-react';

import GenericEditorPreset from '../../generic-editor';
import SwaggerEditorStandalonePreset from '../../standalone';
import Topbar from './Topbar';
import * as topbarActions from '../actions';

const mockOptions = {
  isOAS3: false,
  isSwagger2: true,
  swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json',
  oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json',
  swagger2ConverterUrl: 'https://converter.swagger.io/api/convert',
};

// eslint-disable-next-line no-unused-vars
const mockOas3Spec = {
  openapi: '3.0.2',
  info: {
    title: 'OAS 3.0 sample with multiple servers',
    version: '0.1.0',
  },
  servers: [
    {
      url: 'http://testserver1.com',
    },
    {
      url: 'http://testserver2.com',
    },
  ],
  paths: {
    '/test/': {
      get: {
        responses: {
          200: {
            description: 'Successful Response',
          },
        },
      },
    },
  },
};

test.skip('renders Topbar', async () => {
  render(
    <Topbar
      getComponent={() => () => ''}
      getConfigs={() => () => mockOptions}
      topbarActions={topbarActions}
    />
  );
  const linkElement = screen.getByText(/File/i);
  expect(linkElement).toBeInTheDocument();
});

test('can get swagger-ui', async () => {
  // Given
  // const system = SwaggerUI({
  //   spec: mockOas3Spec
  // })
  // document.queryCommandSupported = () => false;
  const editor = (
    <SwaggerUI
      presets={[SwaggerEditorStandalonePreset, GenericEditorPreset]}
      layout="StandaloneLayout"
      url="https://petstore.swagger.io/v2/swagger.json"
    />
  );
  render(editor);
});
