import {
  detectContentType,
  detectContentTypeStarted,
  detectContentTypeSuccess,
  detectContentTypeFailure,
} from './actions.js';
import { setContent as setContentWrap } from './wrap-actions.js';
import {
  selectIsContentFormatYAML,
  selectIsContentFormatJSON,
  selectContentType,
  selectContentTypeDetectionStatus,
  selectIsContentTypeDetectionInProgress,
  selectIsContentTypeAsyncAPI,
  selectIsContentTypeAsyncAPI2,
  selectIsContentTypeOpenAPI,
  selectIsContentTypeOpenAPI20,
  selectIsContentTypeOpenAPI30x,
  selectIsContentTypeOpenAPI31x,
  selectIsContentTypeAPIDesignSystems,
  selectInferFileExtensionFromContent,
  selectInferFileNameFromContent,
  selectInferFileNameWithExtensionFromContent,
} from './selectors.js';
import reducers from './reducers.js';
import { isValidJSON, isValidJSONObject, isValidYAML, isValidYAMLObject } from './fn.js';

const EditorContentTypePlugin = () => {
  return {
    statePlugins: {
      editor: {
        wrapActions: {
          setContent: setContentWrap,
        },
        actions: {
          detectContentType,
          detectContentTypeStarted,
          detectContentTypeSuccess,
          detectContentTypeFailure,
        },
        selectors: {
          selectIsContentFormatYAML,
          selectIsContentFormatJSON,
          selectContentType,
          selectContentTypeDetectionStatus,
          selectIsContentTypeDetectionInProgress,
          selectIsContentTypeAsyncAPI,
          selectIsContentTypeAsyncAPI2,
          selectIsContentTypeOpenAPI,
          selectIsContentTypeOpenAPI20,
          selectIsContentTypeOpenAPI30x,
          selectIsContentTypeOpenAPI31x,
          selectIsContentTypeAPIDesignSystems,
          selectInferFileExtensionFromContent,
          selectInferFileNameFromContent,
          selectInferFileNameWithExtensionFromContent,
        },
        reducers,
      },
    },
    fn: {
      isValidJSON,
      isValidJSONObject,
      isValidYAML,
      isValidYAMLObject,
    },
  };
};

export default EditorContentTypePlugin;
