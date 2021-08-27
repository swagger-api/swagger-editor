import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReactModal from 'react-modal';

import FileMenuDropdown from './FileMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import ImportFileDropdownItem from './ImportFileDropdownItem';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml';
import * as topbarActions from '../actions';

ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

jest.mock('../actions', () => ({
  getDefinitionLanguageFormat: jest.fn(),
  shouldUpdateDefinitionLanguageFormat: jest.fn(),
  importFile: jest.fn(),
  // importFromURL: jest.fn(),
}));

const setup = ({ languageFormat, shouldUpdate } = {}) => {
  topbarActions.getDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
  });
  topbarActions.shouldUpdateDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
    shouldUpdate: shouldUpdate || false,
  });
  topbarActions.importFile.mockReturnValue(null);
  // topbarActions.importFromURL.mockReturnValue(null);

  return { topbarActions };
};

const renderFileMenuDropdown = (props) => {
  const components = {
    DropdownMenu,
    DropdownItem,
    ImportFileDropdownItem,
    SaveAsJsonOrYaml,
  };

  render(
    <FileMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  const fileMenu = screen.getByText(/File/i);
  const buttonSaveAs = screen.queryByText(/Save \(as/i);
  const buttonConvert = screen.queryByText(/Convert and save as/);

  return {
    fileMenu,
    buttonSaveAs,
    buttonConvert,
    clickFileMenu: () => fireEvent.click(fileMenu),
    clickFileMenuItem: (selector) => fireEvent.click(screen.getByText(selector)),
    hasButtonElement: (selector) => {
      const item = screen.queryByText(selector, { exact: false });
      if (!item) {
        return false;
      }
      return true;
    },
  };
};

afterAll(() => {
  jest.unmock('../actions');
});

test('should render', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { fileMenu } = renderFileMenuDropdown({ topbarActions: actions });

  expect(fileMenu).toBeInTheDocument();
});

test('should be able to click on "Import URL', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, clickFileMenuItem } = renderFileMenuDropdown({ topbarActions: actions });

  clickFileMenu();
  clickFileMenuItem('Import URL');

  const modalElement = screen.getByText('Enter the URL to import from');
  await waitFor(() => modalElement);

  expect(modalElement).toBeInTheDocument();
  // we then could also mock user input, then click "submit"
  // expect(topbarActions.importFromURL).toBeCalled();
});

test('should be able to click on "Import File', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, clickFileMenuItem } = renderFileMenuDropdown({ topbarActions: actions });

  clickFileMenu();
  clickFileMenuItem('Import File');

  // only asserting that method to open file dialog box was called
  expect(topbarActions.importFile).toBeCalled();
});

test('should render partial text: "Save (as', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = renderFileMenuDropdown({ topbarActions: actions });

  clickFileMenu();
  const elementExists = hasButtonElement('Save (as');

  expect(elementExists).toBe(true);
});

test('should render partial text: "Convert and save as', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = renderFileMenuDropdown({ topbarActions: actions });

  clickFileMenu();
  const elementExists = hasButtonElement('Convert and save as');

  expect(elementExists).toBe(true);
});

describe.skip('NYI: importUrl e2e', () => {
  // todo: refactor descriptions once implemented
  // ref: importedData.data/importedData.error are references within component
  // todo: could also implement equivalent topbarActions.importFromURL unit tests
  test('(normal) user clicks on link, but then clicks on cancel prompt.', async () => {});
  test('(default) user clicks on link, inputs valid url is valid; importedData.data exists && importedData.error does not exist', async () => {});
  test('(normal) user clicks on link, but inputs an invalid url; importedData.error exists && importedData.data does not exist', async () => {});
  test('(exception) user clicks on link, inputs valid url is valid; should not see a case where both importedData.data && importedData.error exists', async () => {});
});
