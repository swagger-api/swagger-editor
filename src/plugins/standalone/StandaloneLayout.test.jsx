import React from 'react';
// eslint-disable-next-line no-unused-vars
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SwaggerUI from 'swagger-ui-react';

import GenericEditorPreset from '../generic-editor';
import SwaggerEditorStandalonePreset from './index';
// import Topbar from '../topbar/components/Topbar';
// import LinkHome from '../topbar/components/LinkHome'; // from swagger-ui
// import DropdownItem from '../topbar/components/DropdownItem';
// import DropdownMenu from '../topbar/components/DropdownMenu';
// import FileMenuDropdown from '../topbar/components/FileMenuDropdown';
// import EditMenuDropdown from '../topbar/components/EditMenuDropdown';
// import ImportFileDropdownItem from '../topbar/components/ImportFileDropdownItem';
// import * as topbarActions from '../actions';

// eslint-disable-next-line no-unused-vars
const mockOptions = {
  isOAS3: false,
  isSwagger2: true,
  swagger2GeneratorUrl: 'https://generator.swagger.io/api/swagger.json',
  oas3GeneratorUrl: 'https://generator3.swagger.io/openapi.json',
  swagger2ConverterUrl: 'https://converter.swagger.io/api/convert',
};

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

test.skip('can get swagger-ui (mock editor)', async () => {
  // Given
  const editor = (
    <SwaggerUI
      presets={[SwaggerEditorStandalonePreset, GenericEditorPreset]}
      layout="StandaloneLayout"
      // url="https://petstore.swagger.io/v2/swagger.json"
      spec={mockOas3Spec}
    />
  );
  render(editor);
  // From topbar, a top-level dropdown menu description
  const linkElement1 = screen.getByText(/File/i);
  expect(linkElement1).toBeInTheDocument();
  // From swagger-ui, a 'GET' button within operation
  const linkElement2 = screen.getByText(/get/i);
  expect(linkElement2).toBeInTheDocument();
});
