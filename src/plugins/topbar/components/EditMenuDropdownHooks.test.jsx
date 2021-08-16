import React from 'react';
// eslint-disable-next-line no-unused-vars
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';

import EditMenuDropdownHooks from './EditMenuDropdownHooks';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

// mock es6 re-exports
jest.mock('../actions');

describe('renders EditMenuDropdownHooks', () => {
  // beforeEach(() => {
  //   const components = {
  //     DropdownItem,
  //     DropdownMenu,
  //   };
  //   render(
  //     <EditMenuDropdownHooks
  //       getComponent={(c) => {
  //         return components[c];
  //       }}
  //       topbarActions={topbarActions}
  //     />
  //   );
  // });

  test.skip('should include Edit as the menu description', async () => {
    const spyProp1 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => true);
    const linkElement = screen.getByText(/hook)/i);
    expect(linkElement).toBeInTheDocument();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
  });

  test('on dropdown, should be able to click on "Convert To YAML', async () => {
    const spy = jest.spyOn(topbarActions, 'convertToYaml').mockImplementation();

    const spyProp0 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({ languageFormat: 'yaml' }));

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

    // renders
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

    const linkElement = screen.getByText(/hook/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To YAML');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
    expect(spyProp0).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
    // topbar doesn't render editor, so unlikely any other user visible changes
    // also note, we will need to mock props when this list item is hidden
  });

  test.skip('on dropdown, should be able to click on "Convert To OpenAPI 3', async () => {
    const spy = jest.spyOn(topbarActions, 'convertDefinitionToOas3').mockImplementation();
    const spyProp1 = jest
      .spyOn(topbarActions, 'getDefinitionLanguageFormat')
      .mockImplementation(() => ({
        languageFormat: 'yaml',
      }));
    const spyProp2 = jest
      .spyOn(topbarActions, 'allowConvertDefinitionToOas3')
      .mockImplementation(() => true);

    const linkElement = screen.getByText(/hook/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To OpenAPI 3');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
    expect(spyProp1).toBeCalled();
    expect(spyProp2).toBeCalled();
    // topbar doesn't render editor, so unlikely any other user visible changes
    // also note, we will need to mock props when this list item is hidden
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
});
