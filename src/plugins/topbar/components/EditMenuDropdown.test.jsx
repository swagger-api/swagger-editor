import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import EditMenuDropdown from './EditMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

jest.mock('../actions', () => ({
  convertDefinitionToOas3: jest.fn(),
  convertToYaml: jest.fn(),
}));

const setup = () => {
  topbarActions.convertDefinitionToOas3.mockReturnValue(null);
  topbarActions.convertToYaml.mockReturnValue(null);

  return { topbarActions };
};

const renderEditMenuDropdown = (props) => {
  const components = {
    DropdownMenu,
    DropdownItem,
  };

  render(
    <EditMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  const editMenu = screen.getByText(/Edit/i);

  return {
    editMenu,
    clickEditMenu: () => fireEvent.click(editMenu),
    clickEditMenuItem: (selector) => fireEvent.click(screen.getByText(selector)),
  };
};

afterAll(() => {
  jest.unmock('../actions');
});

test('should render', async () => {
  const { topbarActions: actions } = setup();
  const { editMenu } = renderEditMenuDropdown({ topbarActions: actions });

  expect(editMenu).toBeInTheDocument();
});

test('should convert to YAML', async () => {
  const { topbarActions: actions } = setup();
  const { clickEditMenu, clickEditMenuItem } = renderEditMenuDropdown({ topbarActions: actions });

  clickEditMenu();
  clickEditMenuItem('Convert To YAML');

  expect(topbarActions.convertToYaml).toBeCalled();
});

test('should convert to OpenAPI 3', async () => {
  const { topbarActions: actions } = setup();
  const { clickEditMenu, clickEditMenuItem } = renderEditMenuDropdown({ topbarActions: actions });

  clickEditMenu();
  clickEditMenuItem('Convert To OpenAPI 3');

  expect(topbarActions.convertDefinitionToOas3).toBeCalled();
});
