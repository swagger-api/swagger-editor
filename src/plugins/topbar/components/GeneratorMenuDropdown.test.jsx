import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import GeneratorMenuDropdown from './GeneratorMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';
import * as topbarSelectors from '../selectors';

jest.mock('../actions', () => ({
  instantiateGeneratorClient: jest.fn(),
  downloadGeneratedFile: jest.fn(),
}));

jest.mock('../selectors', () => ({
  selectShouldReInstantiateGeneratorClient: jest.fn(),
}));

const setup = ({ servers, clients, specVersion } = {}) => {
  topbarActions.instantiateGeneratorClient.mockReturnValue({
    servers: servers || ['blue', 'brown'],
    clients: clients || ['apple', 'avocado'],
    specVersion: specVersion || 'some string',
  });
  topbarActions.downloadGeneratedFile.mockImplementation(({ name, type }) => ({
    data: { name, type },
  }));

  topbarSelectors.selectShouldReInstantiateGeneratorClient.mockReturnValue(false);

  return { topbarActions, topbarSelectors };
};

const renderGeneratorMenuDropdown = async (props) => {
  const components = {
    DropdownMenu,
    DropdownItem,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(topbarActions.instantiateGeneratorClient).toBeCalled());
  const serverMenu = screen.queryByText(/Generate Server/i);
  const clientMenu = screen.queryByText(/Generate Client/i);
  const hasServerMenu = serverMenu !== null;
  const hasClientMenu = clientMenu !== null;

  return {
    serverMenu,
    clientMenu,
    hasServerMenu,
    hasClientMenu,
    clickServerMenu() {
      if (hasServerMenu) {
        fireEvent.click(serverMenu);
      }
    },
    clickServerMenuItem(selector) {
      const item = screen.getByText(selector);
      return fireEvent.click(item);
    },
    clickClientMenu() {
      if (hasClientMenu) {
        fireEvent.click(clientMenu);
      }
    },
    clickClientMenuItem(selector) {
      const item = screen.getByText(selector);
      return fireEvent.click(item);
    },
  };
};

afterAll(() => {
  jest.unmock('../actions');
});

test('should render', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup();
  const { serverMenu, clientMenu } = await renderGeneratorMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  expect(serverMenu).toBeInTheDocument();
  expect(clientMenu).toBeInTheDocument();
});

test('should download a generated Server file', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup();
  const { clickServerMenu, clickServerMenuItem } = await renderGeneratorMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickServerMenu();
  clickServerMenuItem('brown');

  expect(topbarActions.downloadGeneratedFile).toBeCalled();
  expect(topbarActions.downloadGeneratedFile.mock.calls.length).toBe(1);
  expect(topbarActions.downloadGeneratedFile.mock.calls[0][0]).toEqual({
    type: 'server',
    name: 'brown',
  });
  expect(topbarSelectors.selectShouldReInstantiateGeneratorClient).toBeCalled();
});

test('should download a generated Client file', async () => {
  const { topbarActions: actions, topbarSelectors: selectors } = setup();
  const { clickClientMenu, clickClientMenuItem } = await renderGeneratorMenuDropdown({
    topbarActions: actions,
    topbarSelectors: selectors,
  });

  clickClientMenu();
  clickClientMenuItem('apple');

  expect(topbarActions.downloadGeneratedFile).toBeCalled();
  expect(topbarActions.downloadGeneratedFile.mock.calls.length).toBe(1);
  expect(topbarActions.downloadGeneratedFile.mock.calls[0][0]).toEqual({
    type: 'client',
    name: 'apple',
  });
  expect(topbarSelectors.selectShouldReInstantiateGeneratorClient).toBeCalled();
});

describe('given servers list is empty', () => {
  test('should render no menu', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({ servers: [] });
    const { serverMenu, clientMenu } = await renderGeneratorMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    expect(serverMenu).not.toBeInTheDocument();
    expect(clientMenu).not.toBeInTheDocument();
    expect(topbarSelectors.selectShouldReInstantiateGeneratorClient).toBeCalled();
  });
});

describe('given clients list is empty', () => {
  test('should render no menu', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({ clients: [] });
    const { serverMenu, clientMenu } = await renderGeneratorMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    expect(serverMenu).not.toBeInTheDocument();
    expect(clientMenu).not.toBeInTheDocument();
    expect(topbarSelectors.selectShouldReInstantiateGeneratorClient).toBeCalled();
  });
});

describe('given both servers and clients list are empty', () => {
  test('should render no menu', async () => {
    const { topbarActions: actions, topbarSelectors: selectors } = setup({
      servers: [],
      clients: [],
    });
    const { serverMenu, clientMenu } = await renderGeneratorMenuDropdown({
      topbarActions: actions,
      topbarSelectors: selectors,
    });

    expect(serverMenu).not.toBeInTheDocument();
    expect(clientMenu).not.toBeInTheDocument();
    expect(topbarSelectors.selectShouldReInstantiateGeneratorClient).toBeCalled();
  });
});
