import { createSelector } from 'reselect';

import { SUCCESS_STATUS, IDLE_STATUS } from './reducers.js';

/**
 * editor state plugin selectors.
 */

export const selectOpenAPI20ConverterURL = () => 'https://converter.swagger.io/api/convert';

/**
 * editorTopBar state plugin selectors.
 */

export const selectEditorTopBarState = (state) => state;

export const selectOpenAPI3GeneratorServerListURL = () =>
  'https://generator3.swagger.io/api/servers';

export const selectOpenAPI3GenerateServerURL = () => 'https://generator3.swagger.io/api/generate';

export const selectOpenAPI3GeneratorServerListStatus = (state) =>
  state.get('openAPI3GeneratorServerListStatus') || IDLE_STATUS;

export const selectOpenAPI3GeneratorServerList = createSelector(
  selectOpenAPI3GeneratorServerListStatus,
  selectEditorTopBarState,
  (status, state) => {
    if (status !== SUCCESS_STATUS) {
      return null;
    }

    return state.get('openAPI3GeneratorServerList').toJS();
  }
);

export const selectOpenAPI3GeneratorClientListURL = () =>
  'https://generator3.swagger.io/api/clients';

export const selectOpenAPI3GenerateClientURL = () => 'https://generator3.swagger.io/api/generate';

export const selectOpenAPI3GeneratorClientListStatus = (state) =>
  state.get('openAPI3GeneratorClientListStatus') || IDLE_STATUS;

export const selectOpenAPI3GeneratorClientList = createSelector(
  selectOpenAPI3GeneratorClientListStatus,
  selectEditorTopBarState,
  (status, state) => {
    if (status !== SUCCESS_STATUS) {
      return null;
    }

    return state.get('openAPI3GeneratorClientList').toJS();
  }
);

export const selectOpenAPI2GeneratorServerListURL = () =>
  'https://generator.swagger.io/api/gen/servers';

export const selectOpenAPI2GenerateServerURL = () => 'https://generator.swagger.io/api/gen/servers';

export const selectOpenAPI2GeneratorServerListStatus = (state) =>
  state.get('openAPI2GeneratorServerListStatus') || IDLE_STATUS;

export const selectOpenAPI2GeneratorServerList = createSelector(
  selectOpenAPI2GeneratorServerListStatus,
  selectEditorTopBarState,
  (status, state) => {
    if (status !== SUCCESS_STATUS) {
      return null;
    }

    return state.get('openAPI2GeneratorServerList').toJS();
  }
);

export const selectOpenAPI2GeneratorClientListURL = () =>
  'https://generator.swagger.io/api/gen/clients';

export const selectOpenAPI2GenerateClientURL = () => 'https://generator.swagger.io/api/gen/clients';

export const selectOpenAPI2GeneratorClientListStatus = (state) =>
  state.get('openAPI2GeneratorClientListStatus') || IDLE_STATUS;

export const selectOpenAPI2GeneratorClientList = createSelector(
  selectOpenAPI2GeneratorClientListStatus,
  selectEditorTopBarState,
  (status, state) => {
    if (status !== SUCCESS_STATUS) {
      return null;
    }

    return state.get('openAPI2GeneratorClientList').toJS();
  }
);
