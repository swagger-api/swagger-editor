import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import GeneratorMenuDropdown from './GeneratorMenuDropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import * as topbarActions from '../actions';

// mock es6 re-exports
jest.mock('../actions');

test('renders GeneratorMenuDropdown and download a generated Server file', async () => {
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
    DropdownMenu,
    DropdownItem,
    GeneratorMenuDropdown,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  await waitFor(() => expect(spyGeneratorList).toBeCalled());
  // top-level dropdown menu, exists after mock resolves
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

test('renders GeneratorMenuDropdown and download a generated Client file', async () => {
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
    DropdownMenu,
    DropdownItem,
    GeneratorMenuDropdown,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  await waitFor(() => expect(spyGeneratorList).toBeCalled());
  // top-level dropdown menu, exists after mock resolves
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

test('renders null GeneratorMenuDropdown when oneOf state lists are empty', async () => {
  const spyGeneratorList = jest
    .spyOn(topbarActions, 'instantiateGeneratorClient')
    .mockImplementation(() => ({
      servers: [],
      clients: ['apple', 'avocado'],
      specVersion: 'some string',
    }));

  const spyShouldReInstantiate = jest
    .spyOn(topbarActions, 'shouldReInstantiateGeneratorClient')
    .mockImplementation(() => {
      return false;
    });

  const components = {
    DropdownMenu,
    DropdownItem,
    GeneratorMenuDropdown,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  await waitFor(() => expect(spyGeneratorList).toBeCalled());
  // top-level dropdown menu, exists after mock resolves
  const linkElement = screen.queryByText(/Generate Client/i);
  expect(linkElement).not.toBeInTheDocument();
  // action method call, that we we want to suppress in test
  expect(spyShouldReInstantiate).toBeCalled();
});

test('renders null GeneratorMenuDropdown when allOf state lists are empty', async () => {
  const spyGeneratorList = jest
    .spyOn(topbarActions, 'instantiateGeneratorClient')
    .mockImplementation(() => ({
      servers: [],
      clients: [],
      specVersion: 'some string',
    }));

  const spyShouldReInstantiate = jest
    .spyOn(topbarActions, 'shouldReInstantiateGeneratorClient')
    .mockImplementation(() => {
      return false;
    });

  const components = {
    DropdownMenu,
    DropdownItem,
    GeneratorMenuDropdown,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  await waitFor(() => expect(spyGeneratorList).toBeCalled());
  // top-level dropdown menu, exists after mock resolves
  const linkElement = screen.queryByText(/Generate Client/i);
  expect(linkElement).not.toBeInTheDocument();
  // action method call, that we we want to suppress in test
  expect(spyShouldReInstantiate).toBeCalled();
});

// dev update: swagger-client has been deprecated. please update this test
test.skip('renders GeneratorMenuDropdown and handle invalid generator url', async () => {
  // This test always passes. The intent is to mock valid url with a different response,
  // and confirm that render still happens correctly, without console.errors
  // We use Mock Service Worker to intercept the http request, so that we can avoid
  // mocking swagger-client+swagger-generator

  // currently using msw directly. once working, can extract into separate mock utils.
  // mock node server, with valid url but mocked "invalid" response
  const server = setupServer(
    // oas2: https://generator.swagger.io/api/swagger.json
    // oas3: https://generator3.swagger.io/openapi.json
    rest.get('https://generator.swagger.io/api/swagger.json', (req, res, ctx) => {
      // respond with invalid status code 4xx
      // console.log('request made');
      return res(ctx.status(404), ctx.json({ message: 'Server Not Found' }));
    })
  );
  // Enable API mocking before tests.
  // beforeAll(() => server.listen());

  // Reset any runtime request handlers we may add during the tests.
  // afterEach(() => server.resetHandlers());

  // Disable API mocking after the tests are done.
  // afterAll(() => server.close());

  server.listen();

  // const spyGeneratorList = jest.spyOn(topbarActions, 'instantiateGeneratorClient');

  const components = {
    DropdownMenu,
    DropdownItem,
    GeneratorMenuDropdown,
  };

  render(
    <GeneratorMenuDropdown
      getComponent={(c) => {
        return components[c];
      }}
      topbarActions={topbarActions}
    />
  );

  // async http call
  // expect(spyGeneratorList).toBeCalled();
  // top-level dropdown menu
  const linkElement = screen.getByText(/Generate Client/i);
  await waitFor(() => linkElement);
  expect(linkElement).toBeInTheDocument();
  fireEvent.click(linkElement);
  // pick an invalid list item to click on (should be empty list)
  const buttonElement = screen.queryByText('apple');
  await waitFor(() => buttonElement);
  expect(buttonElement).not.toBeInTheDocument();

  server.resetHandlers();
  server.close();
});
