import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import Topbar from './Topbar';
import LinkHome from './LinkHome'; // from swagger-ui
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import ImportFileDropdownItem from './ImportFileDropdownItem';
import GeneratorMenuDropdown from './GeneratorMenuDropdown';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml';
import * as topbarActions from '../actions';

jest.mock('../actions', () => ({
  getDefinitionLanguageFormat: jest.fn(),
  shouldUpdateDefinitionLanguageFormat: jest.fn(),
  instantiateGeneratorClient: jest.fn(),
  shouldReInstantiateGeneratorClient: jest.fn(),
  allowConvertDefinitionToOas3: jest.fn(),
}));

const setup = ({
  servers,
  clients,
  specVersion,
  languageFormat,
  shouldUpdate,
  allowConvertDefinitionToOas3,
} = {}) => {
  topbarActions.getDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
  });
  topbarActions.shouldUpdateDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
    shouldUpdate: shouldUpdate || false,
  });
  topbarActions.instantiateGeneratorClient.mockReturnValue({
    servers: servers || ['blue', 'brown'],
    clients: clients || ['apple', 'avocado'],
    specVersion: specVersion || 'some string',
  });
  topbarActions.shouldReInstantiateGeneratorClient.mockReturnValue(false);
  topbarActions.allowConvertDefinitionToOas3.mockReturnValue(allowConvertDefinitionToOas3 || false);

  return { topbarActions };
};

const renderGeneratorMenuDropdown = async (props) => {
  const components = {
    LinkHome,
    DropdownMenu,
    DropdownItem,
    ImportFileDropdownItem,
    GeneratorMenuDropdown,
    SaveAsJsonOrYaml,
  };

  render(
    <Topbar
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(topbarActions.instantiateGeneratorClient).toBeCalled());
  await waitFor(() => expect(topbarActions.getDefinitionLanguageFormat).toBeCalled());
  await waitFor(() => expect(topbarActions.shouldUpdateDefinitionLanguageFormat).toBeCalled());

  const serverMenu = screen.queryByText(/Generate Server/i);
  const clientMenu = screen.queryByText(/Generate Client/i);
  const fileMenu = screen.queryByText(/File/i);
  const editMenu = screen.queryByText(/Edit/i);

  return {
    serverMenu,
    clientMenu,
    fileMenu,
    editMenu,
  };
};

afterAll(() => {
  jest.unmock('../actions');
});

test('should render with required components', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { serverMenu, clientMenu, fileMenu, editMenu } = await renderGeneratorMenuDropdown({
    topbarActions: actions,
  });

  expect(serverMenu).toBeInTheDocument();
  expect(clientMenu).toBeInTheDocument();
  expect(fileMenu).toBeInTheDocument();
  expect(editMenu).toBeInTheDocument();
});
