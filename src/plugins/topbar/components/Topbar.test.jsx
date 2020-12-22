import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Topbar from './Topbar';
import LinkHome from './LinkHome'; // from swagger-ui
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import FileMenuDropdown from './FileMenuDropdown';
import EditMenuDropdown from './EditMenuDropdown';
import ImportFileDropdownItem from './ImportFileDropdownItem';
import * as topbarActions from '../actions';

test('renders Topbar and download a generated Server file', async () => {
  const spyGeneratorList = jest
    .spyOn(topbarActions, 'instantiateGeneratorClient')
    .mockImplementation(() => ({
      servers: ['blue', 'brown'],
      clients: ['apple', 'avocado'],
      specVersion: 'some string',
    }));

  const spyShouldReInstantiate = jest
    .spyOn(topbarActions, 'shouldReInstantiateGeneratorClient')
    .mockImplementation(() => {
      return false;
    });

  const spyDownloadGenerated = jest
    .spyOn(topbarActions, 'downloadGeneratedFile')
    .mockImplementation(({ name, type }) => {
      return { data: { name, type } };
    });

  const components = {
    LinkHome,
    DropdownMenu,
    DropdownItem,
    FileMenuDropdown,
    EditMenuDropdown,
    ImportFileDropdownItem,
  };

  render(
    <Topbar
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  expect(spyGeneratorList).toBeCalled();
  // top-level dropdown menu
  const linkElement = screen.getByText(/Generate Server/i);
  await waitFor(() => linkElement);
  expect(linkElement).toBeInTheDocument();
  fireEvent.click(linkElement);
  // pick a list item to click on
  const buttonElement = screen.getByText('brown');
  await waitFor(() => buttonElement);
  expect(buttonElement).toBeInTheDocument();
  fireEvent.click(buttonElement);
  // action method call
  expect(spyDownloadGenerated).toBeCalled();
  expect(spyDownloadGenerated.mock.calls.length).toBe(1);
  expect(spyDownloadGenerated.mock.calls[0][0]).toEqual({ type: 'server', name: 'brown' });
  // action method call, that we we want to suppress in test
  expect(spyShouldReInstantiate).toBeCalled();
});

test('renders Topbar and download a generated Client file', async () => {
  const spyGeneratorList = jest
    .spyOn(topbarActions, 'instantiateGeneratorClient')
    .mockImplementation(() => ({
      servers: ['blue', 'brown'],
      clients: ['apple', 'avocado'],
      specVersion: 'some string',
    }));

  const spyShouldReInstantiate = jest
    .spyOn(topbarActions, 'shouldReInstantiateGeneratorClient')
    .mockImplementation(() => {
      return false;
    });

  const spyDownloadGenerated = jest
    .spyOn(topbarActions, 'downloadGeneratedFile')
    .mockImplementation(({ name, type }) => {
      return { data: { name, type } };
    });

  const components = {
    LinkHome,
    DropdownMenu,
    DropdownItem,
    FileMenuDropdown,
    EditMenuDropdown,
    ImportFileDropdownItem,
  };

  render(
    <Topbar
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  expect(spyGeneratorList).toBeCalled();
  // top-level dropdown menu
  const linkElement = screen.getByText(/Generate Client/i);
  await waitFor(() => linkElement);
  expect(linkElement).toBeInTheDocument();
  fireEvent.click(linkElement);
  // pick a list item to click on
  const buttonElement = screen.getByText('apple');
  await waitFor(() => buttonElement);
  expect(buttonElement).toBeInTheDocument();
  fireEvent.click(buttonElement);
  // action method call
  expect(spyDownloadGenerated).toBeCalled();
  expect(spyDownloadGenerated.mock.calls.length).toBe(1);
  expect(spyDownloadGenerated.mock.calls[0][0]).toEqual({ type: 'client', name: 'apple' });
  // action method call, that we we want to suppress in test
  expect(spyShouldReInstantiate).toBeCalled();
});
