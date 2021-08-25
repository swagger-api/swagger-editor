import React from 'react';
// eslint-disable-next-line no-unused-vars
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReactModal from 'react-modal';

import FileMenuDropdownHooks from './FileMenuDropdownHooks';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import ImportFileDropdownItem from './ImportFileDropdownItem';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml';
import * as topbarActions from '../actions';

ReactModal.setAppElement('*'); // suppresses modal-related test warnings.

jest.mock('../actions', () => ({
  getDefinitionLanguageFormat: jest.fn(),
  shouldUpdateDefinitionLanguageFormat: jest.fn(),
  handleImportFile: jest.fn(),
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
  topbarActions.handleImportFile.mockReturnValue(null);
  // topbarActions.importFromURL.mockReturnValue(null);

  return { topbarActions };
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
  await waitFor(() => expect(topbarActions.shouldUpdateDefinitionLanguageFormat).toBeCalled());
  const fileMenu = screen.getByText(/Main/i);
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
  const { fileMenu } = await renderFileMenuDropdown({ topbarActions: actions });

  expect(fileMenu).toBeInTheDocument();
});

test('should be able to click on "Import URL', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, clickFileMenuItem } = await renderFileMenuDropdown({
    topbarActions: actions,
  });

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
  const { clickFileMenu, clickFileMenuItem } = await renderFileMenuDropdown({
    topbarActions: actions,
  });

  clickFileMenu();
  clickFileMenuItem('Import File');

  // only asserting that method to open file dialog box was called
  expect(topbarActions.handleImportFile).toBeCalled();
});

test('should render partial text: "Save (as', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
    topbarActions: actions,
  });

  clickFileMenu();
  const elementExists = hasButtonElement('Save (as');

  expect(elementExists).toBe(true);
});

test('should render partial text: "Convert and save as', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdateDefinitionLanguageFormat: false,
  });
  const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
    topbarActions: actions,
  });

  clickFileMenu();
  const elementExists = hasButtonElement('Convert and save as');

  expect(elementExists).toBe(true);
});

describe('when json', () => {
  test('should render partial text: "Save (as JSON)', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'json',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Save (as JSON)');

    expect(elementExists).toBe(true);
  });

  test('should render partial text: "Convert and save as YAML', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'json',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Convert and save as YAML');

    expect(elementExists).toBe(true);
  });
});

describe('when yaml', () => {
  test('should render partial text: "Save (as YAML)', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'yaml',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
    });

    clickFileMenu();
    const elementExists = hasButtonElement('Save (as YAML)');

    expect(elementExists).toBe(true);
  });

  test('should render partial text: "Convert and save as JSON', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'yaml',
      shouldUpdateDefinitionLanguageFormat: false,
    });
    const { clickFileMenu, hasButtonElement } = await renderFileMenuDropdown({
      topbarActions: actions,
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
