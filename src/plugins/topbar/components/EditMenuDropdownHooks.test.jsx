import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import EditMenuDropdownHooks from './EditMenuDropdownHooks';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

jest.mock('../actions', () => ({
  convertDefinitionToOas3: jest.fn(),
  convertToYaml: jest.fn(),
  clearEditor: jest.fn(),
  allowConvertDefinitionToOas3: jest.fn(),
  getDefinitionLanguageFormat: jest.fn(),
  shouldUpdateDefinitionLanguageFormat: jest.fn(),
}));

const setup = ({ languageFormat, shouldUpdate, allowConvertDefinitionToOas3 } = {}) => {
  topbarActions.convertDefinitionToOas3.mockReturnValue(null);
  topbarActions.convertToYaml.mockReturnValue(null);
  topbarActions.clearEditor.mockReturnValue(null);

  topbarActions.allowConvertDefinitionToOas3.mockReturnValue(allowConvertDefinitionToOas3 || false);
  topbarActions.getDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
  });
  topbarActions.shouldUpdateDefinitionLanguageFormat.mockReturnValue({
    languageFormat: languageFormat || 'yaml',
    shouldUpdate: shouldUpdate || false,
  });

  return { topbarActions };
};

const renderEditMenuDropdown = async (props) => {
  const components = {
    DropdownMenu,
    DropdownItem,
  };

  render(
    <EditMenuDropdownHooks
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(topbarActions.allowConvertDefinitionToOas3).toBeCalled());
  await waitFor(() => expect(topbarActions.getDefinitionLanguageFormat).toBeCalled());
  await waitFor(() => expect(topbarActions.shouldUpdateDefinitionLanguageFormat).toBeCalled());
  const editMenu = screen.getByText(/More/i);

  return {
    editMenu,
    clickEditMenu: () => fireEvent.click(editMenu),
    clickEditMenuItem: (selector) => fireEvent.click(screen.getByText(selector)),
    hasMenuItem: (selector) => {
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
    shouldUpdate: false,
    allowConvertDefinitionToOas3: true,
  });
  const { editMenu } = await renderEditMenuDropdown({ topbarActions: actions });

  expect(editMenu).toBeInTheDocument();
});

test('should Clear Editor', async () => {
  const { topbarActions: actions } = setup({
    languageFormat: 'json',
    shouldUpdate: false,
    allowConvertDefinitionToOas3: true,
  });
  const { clickEditMenu, clickEditMenuItem } = await renderEditMenuDropdown({
    topbarActions: actions,
  });

  clickEditMenu();
  clickEditMenuItem('Clear Editor');

  expect(topbarActions.clearEditor).toBeCalled();
});

describe('when json', () => {
  test('should convert to YAML', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'json',
      shouldUpdate: false,
      allowConvertDefinitionToOas3: true,
    });
    const { clickEditMenu, clickEditMenuItem } = await renderEditMenuDropdown({
      topbarActions: actions,
    });

    clickEditMenu();
    clickEditMenuItem('Convert To YAML');

    expect(topbarActions.convertToYaml).toBeCalled();
  });
});

describe('when yaml', () => {
  test('should NOT render menu item to convert to YAML', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'yaml',
      shouldUpdate: true,
      allowConvertDefinitionToOas3: true,
    });
    const { clickEditMenu, hasMenuItem } = await renderEditMenuDropdown({ topbarActions: actions });

    clickEditMenu();
    const elementExists = hasMenuItem('Convert To YAML');

    expect(elementExists).toBe(false);
  });
});

describe('when oas2', () => {
  test('should convert to OpenAPI 3', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'json',
      shouldUpdate: false,
      allowConvertDefinitionToOas3: true,
    });
    const { clickEditMenu, clickEditMenuItem } = await renderEditMenuDropdown({
      topbarActions: actions,
    });

    clickEditMenu();
    clickEditMenuItem('Convert To OpenAPI 3');

    expect(topbarActions.convertDefinitionToOas3).toBeCalled();
  });
});

describe('when not oas2', () => {
  test('should NOT render menu item to convert to OpenAPI 3', async () => {
    const { topbarActions: actions } = setup({
      languageFormat: 'json',
      shouldUpdate: false,
      allowConvertDefinitionToOas3: false,
    });
    const { clickEditMenu, hasMenuItem } = await renderEditMenuDropdown({ topbarActions: actions });

    clickEditMenu();
    const elementExists = hasMenuItem('Convert To OpenAPI 3');

    expect(elementExists).toBe(false);
  });
});

describe.skip('NYI: toggling e2e', () => {
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
