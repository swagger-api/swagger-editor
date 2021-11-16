import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import DropdownItem from './DropdownItem';
import SaveAsJsonOrYaml from './SaveAsJsonOrYaml';

// mock es6 re-exports
// jest.mock('../actions');

const propMethods = {
  onSaveAsJsonClick: jest.fn(),
  onSaveAsYamlClick: jest.fn(),
};

describe('renders JSON menu options', () => {
  beforeEach(() => {
    const languageFormat = 'json';
    const components = {
      DropdownItem,
    };

    render(
      <SaveAsJsonOrYaml
        getComponent={(c) => {
          return components[c];
        }}
        languageFormat={languageFormat}
        onSaveAsJsonClick={propMethods.onSaveAsJsonClick}
        onSaveAsYamlClick={propMethods.onSaveAsYamlClick}
      />
    );
  });

  test('should be able to click on "Save (as JSON)', async () => {
    const spy = jest.spyOn(propMethods, 'onSaveAsJsonClick').mockImplementation();

    const buttonElement = screen.getByText('Save (as JSON)');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
  });

  test('should be able to click on "Convert and save as YAML', async () => {
    const spy = jest.spyOn(propMethods, 'onSaveAsYamlClick').mockImplementation();

    const buttonElement = screen.getByText('Convert and save as YAML');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
  });
});

describe('renders YAML menu options', () => {
  beforeEach(() => {
    const languageFormat = 'yaml';
    const components = {
      DropdownItem,
    };

    render(
      <SaveAsJsonOrYaml
        getComponent={(c) => {
          return components[c];
        }}
        languageFormat={languageFormat}
        onSaveAsJsonClick={propMethods.onSaveAsJsonClick}
        onSaveAsYamlClick={propMethods.onSaveAsYamlClick}
      />
    );
  });

  test('should be able to click on "Save (as YAML)', async () => {
    const spy = jest.spyOn(propMethods, 'onSaveAsYamlClick').mockImplementation();

    const buttonElement = screen.getByText('Save (as YAML)');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
  });

  test('should be able to click on "Convert and save as JSON', async () => {
    const spy = jest.spyOn(propMethods, 'onSaveAsJsonClick').mockImplementation();

    const buttonElement = screen.getByText('Convert and save as JSON');
    await waitFor(() => buttonElement);
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(spy).toBeCalled();
  });
});
