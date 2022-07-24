import createSafeActionWrapper from '../../utils/create-safe-action-wrapper.js';
import { IDLE_STATUS, FAILURE_STATUS } from './reducers.js';

// eslint-disable-next-line import/prefer-default-export
export const detectContentTypeSuccess = createSafeActionWrapper((oriAction, system) => () => {
  const { editorSelectors, editorTopBarSelectors, editorTopBarActions } = system;
  const triggerStatuses = [IDLE_STATUS, FAILURE_STATUS];

  if (
    triggerStatuses.includes(editorTopBarSelectors.selectOpenAPI3GeneratorServerListStatus()) &&
    (editorSelectors.selectIsContentTypeOpenAPI30x() ||
      editorSelectors.selectIsContentTypeOpenAPI31x())
  ) {
    editorTopBarActions.fetchOpenAPI3GeneratorServerList();
  }

  if (
    triggerStatuses.includes(editorTopBarSelectors.selectOpenAPI3GeneratorClientListStatus()) &&
    (editorSelectors.selectIsContentTypeOpenAPI30x() ||
      editorSelectors.selectIsContentTypeOpenAPI31x())
  ) {
    editorTopBarActions.fetchOpenAPI3GeneratorClientList();
  }

  if (
    triggerStatuses.includes(editorTopBarSelectors.selectOpenAPI2GeneratorServerListStatus()) &&
    editorSelectors.selectIsContentTypeOpenAPI20()
  ) {
    editorTopBarActions.fetchOpenAPI2GeneratorServerList();
  }

  if (
    triggerStatuses.includes(editorTopBarSelectors.selectOpenAPI2GeneratorClientListStatus()) &&
    editorSelectors.selectIsContentTypeOpenAPI20()
  ) {
    editorTopBarActions.fetchOpenAPI2GeneratorClientList();
  }
});
