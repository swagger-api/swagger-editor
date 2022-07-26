import { createSelector } from 'reselect';

import { initialState } from './reducers.js';

export const selectContentTypeDetectionStatus = (state) => state.get('contentTypeDetectionStatus');

export const selectContentType = (state) => state.get('contentType') || initialState.contentType;

export const selectIsContentTypeOpenAPI = createSelector(selectContentType, (contentType) => {
  return contentType !== null && contentType.startsWith('application/vnd.oai.openapi');
});

export const selectIsContentTypeOpenAPI20 = createSelector(
  selectIsContentTypeOpenAPI,
  selectContentType,
  (isContentOpenAPI, contentType) => {
    return isContentOpenAPI && /version=2\.0$/.test(contentType);
  }
);

export const selectIsContentTypeOpenAPI30x = createSelector(
  selectIsContentTypeOpenAPI,
  selectContentType,
  (isContentOpenAPI, contentType) => {
    return isContentOpenAPI && /version=3\.0\.\d+$/.test(contentType);
  }
);

export const selectIsContentTypeOpenAPI31x = createSelector(
  selectIsContentTypeOpenAPI,
  selectContentType,
  (isContentOpenAPI, contentType) => {
    return isContentOpenAPI && /version=3\.1\.\d+$/.test(contentType);
  }
);

export const selectIsContentTypeAsyncAPI = createSelector(selectContentType, (contentType) => {
  return contentType !== null && contentType.startsWith('application/vnd.aai.asyncapi');
});

export const selectIsContentTypeAsyncAPI2 = createSelector(
  selectIsContentTypeAsyncAPI,
  selectContentType,
  (isContentAsyncAPI, contentType) => {
    return isContentAsyncAPI && /version=2.\d+\.\d+$/.test(contentType);
  }
);

export const selectIsContentTypeAPIDesignSystems = createSelector(
  selectContentType,
  (contentType) => {
    return contentType !== null && contentType.startsWith('application/vnd.aai.apidesignsystems');
  }
);

export const selectIsContentFormatJSON = createSelector(selectContentType, (contentType) => {
  return (
    contentType !== null && (contentType === 'application/json' || contentType.includes('+json'))
  );
});

export const selectIsContentFormatYAML = createSelector(selectContentType, (contentType) => {
  return contentType !== null && (contentType === 'text/yaml' || contentType.includes('+yaml'));
});

export const selectInferFileExtensionFromContent = createSelector(
  selectIsContentFormatJSON,
  selectIsContentFormatYAML,
  (isJSON, isYAML) => {
    if (isJSON) {
      return '.json';
    }
    if (isYAML) {
      return '.yaml';
    }

    return '.txt';
  }
);

export const selectInferFileNameFromContent = createSelector(
  selectIsContentTypeOpenAPI20,
  selectIsContentTypeOpenAPI30x,
  selectIsContentTypeOpenAPI31x,
  selectIsContentTypeAsyncAPI2,
  (isOpenAPI20, isOpenAPI30x, isOpenAPI31x, isAsyncAPI2) => {
    /* eslint-disable no-nested-ternary */
    return isOpenAPI20
      ? 'openapi2'
      : isOpenAPI30x
      ? 'openapi3_0'
      : isOpenAPI31x
      ? 'openapi3_1'
      : isAsyncAPI2
      ? 'asyncapi2'
      : 'definition';
    /* eslint-enable */
  }
);

export const selectInferFileNameWithExtensionFromContent = createSelector(
  selectInferFileExtensionFromContent,
  selectInferFileNameFromContent,
  (extension, fileName) => `${fileName}${extension}`
);
