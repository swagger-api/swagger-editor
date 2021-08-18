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
// mock es6 re-exports
jest.mock('../actions');

describe('renders FileMenuDropdownHooks', () => {
  test('should include Main as the menu description', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    expect(linkElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, should be able to click on "Import URL', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Import URL');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);

    const modalElement = screen.getByText('Enter the URL to import from');
    await waitFor(() => modalElement);
    expect(modalElement).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    // we could mock user input, then click "submit"
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, should be able to click on "Import File', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Import File');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we may be able to check that the file dialog box opens
    // then we could define a file to upload with "userEvent.upload",
    // then we could mock topbarActions, to check calls.length
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, should render partial text: "Save (as', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Save \(as/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, when yaml, should render text: "Save (as YAML)', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Save \(as YAML\)/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, when json, should render text: "Save (as JSON)', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'json',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'json',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Save \(as JSON\)/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, should render partial text: "Convert and save as', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Convert and save as/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, when yaml, should render text: "Convert and save as JSON', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Convert and save as JSON/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
  });

  test('on dropdown, when json, should render text: "Convert and save as YAML', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'json',
      }));
    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'json',
        shouldUpdate: false,
      }));

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
      SaveAsJsonOrYaml,
    };
    render(
      <FileMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/Main/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText(/Convert and save as YAML/);
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
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
});
