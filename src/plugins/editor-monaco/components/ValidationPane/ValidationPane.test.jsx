import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import ValidationPane from './ValidationPane.jsx';
import * as editorSelectors from '../../selectors.js';
import * as editorActions from '../../actions.js';

jest.mock('../../selectors.js', () => ({
  getEditorMarkers: jest.fn(),
}));

afterAll(() => {
  jest.unmock('../../selectors.js');
});

const setup = ({ markerErrorList } = {}) => {
  editorSelectors.getEditorMarkers.mockReturnValue(markerErrorList);
  const onValidationClick = jest.fn();
  return { editorSelectors, editorActions, onValidationClick };
};

const renderValidationPane = async (props) => {
  render(
    <ValidationPane
      {...props} // eslint-disable-line react/jsx-props-no-spreading
    />
  );

  await waitFor(() => expect(editorSelectors.getEditorMarkers).toBeCalled());
  return {
    hasTableItem: (selector) => {
      const item = screen.queryByText(selector, { exact: false });
      if (!item) {
        return false;
      }
      return true;
    },
    clickTableItem: (selector) => fireEvent.click(screen.getByText(selector)),
  };
};

describe('with empty errorMarkerErrorList', () => {
  test('should render with table headers and no table rows', async () => {
    const columnMessage1 = 'should always have a title';

    const {
      onValidationClick,
      editorSelectors: selectors,
      editorActions: actions,
    } = setup({
      markerErrorList: [],
    });
    const { hasTableItem } = await renderValidationPane({
      onValidationClick,
      editorSelectors: selectors,
      editorActions: actions,
    });

    const elementHeaderExists1 = hasTableItem('Line');
    expect(elementHeaderExists1).toBe(true);
    const elementHeaderExists2 = hasTableItem('Description');
    expect(elementHeaderExists2).toBe(true);
    const elementRowExists1 = hasTableItem(columnMessage1);
    expect(elementRowExists1).toBe(false);
  });
});

describe('with populated markerErrorList', () => {
  test('should respond to clickEvent within table rows', async () => {
    const columnMessage1 = 'should always have a title';
    const columnMessage2 = 'should always have a description';
    const columnStartLineNumber1 = 2;
    const columnStartLineNumber2 = 3;

    const {
      onValidationClick,
      editorSelectors: selectors,
      editorActions: actions,
    } = setup({
      markerErrorList: [
        {
          startLineNumber: columnStartLineNumber1,
          message: columnMessage1,
        },
        {
          startLineNumber: columnStartLineNumber2,
          message: columnMessage2,
        },
      ],
    });
    const { hasTableItem, clickTableItem } = await renderValidationPane({
      onValidationClick,
      editorSelectors: selectors,
      editorActions: actions,
    });

    const elementRowExists1 = hasTableItem(columnMessage1);
    expect(elementRowExists1).toBe(true);
    const elementRowExists2 = hasTableItem(columnMessage2);
    expect(elementRowExists2).toBe(true);

    clickTableItem(columnMessage1);
    expect(onValidationClick).toBeCalled();
    expect(onValidationClick).toBeCalledTimes(1);

    clickTableItem(columnStartLineNumber2);
    expect(onValidationClick).toBeCalled();
    expect(onValidationClick).toBeCalledTimes(2);

    expect(onValidationClick.mock.calls[0][0].message).toBe(columnMessage1);
    expect(onValidationClick.mock.calls[1][0].startLineNumber).toBe(columnStartLineNumber2);
  });
});
