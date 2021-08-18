import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import EditMenuDropdownHooks from './EditMenuDropdownHooks';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

// mock es6 re-exports
jest.mock('../actions');

describe('renders EditMenuDropdownHooks', () => {
  test('should include Edit as the menu description', async () => {
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
    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => true);

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    expect(linkElement).toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  test('on dropdown, when json, should be able to click on "Convert To YAML', async () => {
    const spy = jest.spyOn(topbarActions, 'convertToYaml').mockImplementation();

    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({ languageFormat: 'json' }));

    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'json',
        shouldUpdate: true,
      }));

    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => {
        return false;
      });

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To YAML');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  test('on dropdown, when oas2, should be able to click on "Convert To OpenAPI 3', async () => {
    const spy = jest.spyOn(topbarActions, 'convertDefinitionToOas3').mockImplementation();

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

    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => {
        return true;
      });

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To OpenAPI 3');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  // Section: The "negatives", e.g. should not display menu element
  test('on dropdown, when yaml, should NOT be able to click on "Convert To YAML', async () => {
    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({ languageFormat: 'yaml' }));

    const spyProp1 = jest
      .spyOn(topbarActions, 'shouldUpdateDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
        shouldUpdate: false,
      }));

    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => {
        return false;
      });

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.queryByText('Convert To YAML');
    await waitFor(() => buttonElement);
    expect(buttonElement).not.toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  test('on dropdown, if not oas2, should NOT be able to click on "Convert To OpenAPI 3', async () => {
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

    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => {
        return false;
      });

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.queryByText('Convert To OpenAPI 3');
    await waitFor(() => buttonElement);
    expect(buttonElement).not.toBeInTheDocument();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  // todo: display repeated toggle of state
  test.skip('hook should toggle/revert display of "Convert To OpenAPI 3', async () => {
    // we should just test/assert the hook for current value,
    // so that the actually rendering is not important
    // Case 1 Steps:
    // init to true
    // act useEffect to false, and assert hide
    // act useEffect to true, and assert display
    // act useEffect to false again, and assert hide
    // Case 2 Steps (opposite initialState of Case 1):
    // init to false
    // act useEffect to true, and assert hide
    // act useEffect to false, and assert display
    // act useEffect to true again, and assert hide
  });

  test('on dropdown, should be able to click on "Clear Editor', async () => {
    const spy = jest.spyOn(topbarActions, 'clearEditor').mockImplementation();

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
    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => true);

    // render
    const components = {
      DropdownItem,
      DropdownMenu,
    };
    render(
      <EditMenuDropdownHooks
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );

    // act & assert
    const linkElement = screen.getByText(/hook/i);
    await waitFor(() => linkElement);
    fireEvent.click(linkElement);

    const buttonElement = screen.queryByText('Clear Editor');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);

    expect(spy).toBeCalled();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });
});
