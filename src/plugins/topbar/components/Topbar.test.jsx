import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import Topbar from './Topbar.jsx';
import LinkHome from './LinkHome.jsx';
import DropdownItem from './DropdownItem.jsx';
import DropdownMenu from './DropdownMenu.jsx';
import ImportFileDropdownItem from './ImportFileDropdownItem.jsx';
import GeneratorMenuDropdown from './GeneratorMenuDropdown.jsx';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml.jsx';
import Modal from '../../modals/components/Modal.jsx';
import ModalBody from '../../modals/components/ModalBody.jsx';
import ModalFooter from '../../modals/components/ModalFooter.jsx';
import ModalHeader from '../../modals/components/ModalHeader.jsx';
import ModalTitle from '../../modals/components/ModalTitle.jsx';
import AlertDialog from '../../dialogs/components/AlertDialog.jsx';
import ConfirmDialog from '../../dialogs/components/ConfirmDialog.jsx';
import * as topbarActions from '../actions/index.js';
import * as topbarSelectors from '../selectors.js';

jest.mock('../actions/index.js', () => ({
  getDefinitionLanguageFormat: jest.fn(),
  instantiateGeneratorClient: jest.fn(),
  allowConvertDefinitionToOas3: jest.fn(),
}));

jest.mock('../selectors.js', () => ({
  selectShouldUpdateDefinitionLanguageFormat: jest.fn(),
  selectShouldReInstantiateGeneratorClient: jest.fn(),
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
  topbarActions.instantiateGeneratorClient.mockReturnValue({
    servers: servers || ['blue', 'brown'],
    clients: clients || ['apple', 'avocado'],
    specVersion: specVersion || 'some string',
  });
  topbarActions.allowConvertDefinitionToOas3.mockReturnValue(allowConvertDefinitionToOas3 || false);

  topbarSelectors.selectShouldReInstantiateGeneratorClient.mockReturnValue(false);
  topbarSelectors.selectShouldUpdateDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
    shouldUpdate: shouldUpdate || false,
  });

  return { topbarActions, topbarSelectors };
};

const renderGeneratorMenuDropdown = async (props) => {
  const components = {
    LinkHome,
    DropdownMenu,
    DropdownItem,
    ImportFileDropdownItem,
    GeneratorMenuDropdown,
    SaveAsJsonOrYaml,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    AlertDialog,
    ConfirmDialog,
  };

  const getComponent = (name, container = false) => {
    const Component = components[name];

    if (!container) return Component;

    // eslint-disable-next-line react/jsx-props-no-spreading, react/function-component-definition
    return (...componentProps) => <Component {...componentProps} getComponent={getComponent} />;
  };

  render(
    <Topbar
      getComponent={getComponent}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(topbarActions.instantiateGeneratorClient).toBeCalled());
  await waitFor(() => expect(topbarActions.getDefinitionLanguageFormat).toBeCalled());
  await waitFor(() =>
    expect(topbarSelectors.selectShouldUpdateDefinitionLanguageFormat).toBeCalled()
  );

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
  jest.unmock('../actions/index.js');
  jest.unmock('../selectors.js');
});

test('should render with required components', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { serverMenu, clientMenu, fileMenu, editMenu } = await renderGeneratorMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  expect(serverMenu).toBeInTheDocument();
  expect(clientMenu).toBeInTheDocument();
  expect(fileMenu).toBeInTheDocument();
  expect(editMenu).toBeInTheDocument();
});
