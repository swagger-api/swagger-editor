import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import EditMenuDopdown from './EditMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

describe('renders EditMenuDopdown', () => {
  beforeEach(() => {
    const components = {
      DropdownItem,
      DropdownMenu,
    };

    render(
      <EditMenuDopdown
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );
  });

  test('should include Edit as the menu description', async () => {
    const linkElement = screen.getByText(/Edit/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('on dropdown, should be able to click on "Convert To YAML', async () => {
    const linkElement = screen.getByText(/Edit/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To YAML');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // topbar doesn't render editor, so unlikely any other user visible changes
    // also note, we will need to mock props when this list item is hidden
  });

  test('on dropdown, should be able to click on "Convert To OpenAPI 3', async () => {
    const linkElement = screen.getByText(/Edit/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert To OpenAPI 3');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // topbar doesn't render editor, so unlikely any other user visible changes
    // also note, we will need to mock props when this list item is hidden
  });
});
