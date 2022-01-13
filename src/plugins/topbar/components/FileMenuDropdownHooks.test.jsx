import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReactModal from 'react-modal';

import FileMenuDropdownHooks from './FileMenuDropdownHooks.jsx';
import DropdownItem from './DropdownItem.jsx';
import DropdownMenu from './DropdownMenu.jsx';
import ImportFileDropdownItem from './ImportFileDropdownItem.jsx';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml.jsx';
import * as topbarActions from '../actions/index.js';
import * as topbarSelectors from '../selectors.js';

ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

jest.mock('../actions', () => ({
  getDefinitionLanguageFormat: jest.fn(),
  importFile: jest.fn(),
}));

jest.mock('../selectors', () => ({
  selectShouldUpdateDefinitionLanguageFormat: jest.fn(),
}));

const setup = ({ languageFormat, shouldUpdate } = {}) => {
  topbarActions.getDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
  });
  topbarActions.importFile.mockReturnValue(null);

  topbarSelectors.selectShouldUpdateDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
    shouldUpdate: shouldUpdate || false,
  });

  return { topbarActions, topbarSelectors };
};

const renderFileMenuDropdown = async (props) => {
  const components = {
    DropdownMenu,
    DropdownItem,
    ImportFileDropdownItem,
    SaveAsJsonOrYaml,
  };

  render(
    <FileMenuDropdownHooks
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(topbarActions.getDefinitionLanguageFormat).toBeCalled());
  await waitFor(() =>
    expect(topbarSelectors.selectShouldUpdateDefinitionLanguageFormat).toBeCalled()
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
  jest.unmock('../selectors');
});

test('should render', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { fileMenu } = await renderFileMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  expect(fileMenu).toBeInTheDocument();
});

test('should be able to click on "Import URL', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, clickFileMenuItem } = await renderFileMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickFileMenu();
  clickFileMenuItem('Import URL');

  const modalElement = screen.getByText('Enter the URL to import from');
  await waitFor(() => modalElement);
  expect(modalElement).toBeInTheDocument();
});

test('should be able to click on "Import File', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, clickFileMenuItem } = await renderFileMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickFileMenu();
  clickFileMenuItem('Import File');

  // only asserting that method to open file dialog box was called
  expect(topbarActions.importFile).toBeCalled();
});

test('should render partial text: "Save (as', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickFileMenu();
  const elementExists = hasButtonElement('Save (as');

  expect(elementExists).toBe(true);
});

test('should render partial text: "Convert and save as', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickFileMenu();
  const elementExists = hasButtonElement('Convert and save as');

  expect(elementExists).toBe(true);
});

describe('when json', () => {
  test('should render partial text: "Save (as JSON)', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({
      languageFormat: 'json',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Save (as JSON)');

    expect(elementExists).toBe(true);
  });

  test('should render partial text: "Convert and save as YAML', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({
      languageFormat: 'json',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Convert and save as YAML');

    expect(elementExists).toBe(true);
  });
});

describe('when yaml', () => {
  test('should render partial text: "Save (as YAML)', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({
      languageFormat: 'yaml',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Save (as YAML)');

    expect(elementExists).toBe(true);
  });

  test('should render partial text: "Convert and save as JSON', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({
      languageFormat: 'yaml',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Convert and save as JSON');

    expect(elementExists).toBe(true);
  });
});

describe.skip('e2e: importUrl', () => {
  // todo: return different mockImplementations of topbarActions.importFromURL
  // and assert for expected (changed) behavior, e.g. new error modal, error text
  // ref: importedData.data/importedData.error are references within component
  test('(default) user clicks on link, inputs valid url is valid; importedData.data exists && importedData.error does not exist', async () => {});
  test('(normal) user clicks on link, but inputs an invalid url; importedData.error exists && importedData.data does not exist', async () => {});
  test('(exception) user clicks on link, inputs valid url is valid; should not see a case where both importedData.data && importedData.error exists', async () => {});
});
describe.skip('unit: should be able to cancel/exit various Modal Wrappers', () => {
  // todo: reminder to create, but better to create individual Modal wrapper test files
  // jest.fn 'closeModalClick'
  // render the wrapper
  // assert text displays
  // act close button
  // assert jest.fn .toHavenBeenCalledTimes(1)
  test('ModalErrorWrapper', async () => {});
  test('ModalConfirmWrapper', async () => {});
  test('ModalInputWrapper', async () => {}); // importUrl
});
