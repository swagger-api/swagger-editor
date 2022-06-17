// re-export
export {
  getIsOasOrAsyncApi2,
  shouldUpdateDefinitionLanguage,
} from '../../utils/spec-get-definition-language.js';

export const ASYNCAPI_PARSER_ERROR_MARKERS = 'asyncapi_parser_error_markers';

export const updateAsyncApiParserMarkers = (markers = []) => {
  return {
    payload: markers,
    type: ASYNCAPI_PARSER_ERROR_MARKERS,
  };
};
