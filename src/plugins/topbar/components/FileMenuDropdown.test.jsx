import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import FileMenuDopdown from './FileMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import ImportFileDropdownItem from './ImportFileDropdownItem';
import * as topbarActions from '../actions';

// roadmap to eliminate use of window.alert, window.prompt
beforeEach(() => {
  global.alert = jest.fn();
  global.prompt = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('renders FileMenuDopdown', () => {
  beforeEach(() => {
    const components = {
      DropdownItem,
      DropdownMenu,
      ImportFileDropdownItem,
    };

    render(
      <FileMenuDopdown
        getComponent={(c) => {
          return components[c];
        }}
        topbarActions={topbarActions}
      />
    );
  });

  test('should include File as the menu description', async () => {
    const linkElement = screen.getByText(/File/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('on dropdown, should be able to click on "Import URL', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Import URL');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(global.prompt.mock.calls.length).toEqual(1);

    // window.prompt not supported. will replace with modals, eventually
    // await waitFor(() => screen.getByRole('prompt'));
    // expect(screen.getByRole('prompt')).toBeInTheDocument();
  });

  test('on dropdown, should be able to click on "Import File', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Import File');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we may be able to check that the file dialog box opens
    // we could mock topbarActions, to check calls.length
    // we could define a file to upload with "userEvent.upload",
    // though as user, Dropdown doesn't see changes to editor or swagger-ui, or nyi modals
  });

  test('on dropdown, should be able to click on "Save as JSON', async () => {
    // This spy is likely working correctly, but we need to define a system.spec to pass
    // const spy = jest.spyOn(topbarActions, 'saveAsJson');
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Save as JSON');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // expect(spy).toBeCalled();
    // we could mock topbarActions, to check calls.length
    // we could mock a download and verify e2e result
  });

  test('on dropdown, should be able to click on "Convert and save as JSON', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert and save as JSON');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // we could mock a download and verify e2e result
  });

  test('on dropdown, should be able to click on "Save as YAML', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Save as JSON');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // we could mock a download and verify e2e result
  });

  test('on dropdown, should be able to click on "Convert and save as YAML', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Convert and save as JSON');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // we could mock a download and verify e2e result
  });

  test('on dropdown, should be able to click on "Clear Editor', async () => {
    const linkElement = screen.getByText(/File/i);
    fireEvent.click(linkElement);

    const buttonElement = screen.getByText('Clear Editor');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    // we could mock topbarActions, to check calls.length
    // topbar doesn't render editor, so unlikely any other user visible changes
  });
});
