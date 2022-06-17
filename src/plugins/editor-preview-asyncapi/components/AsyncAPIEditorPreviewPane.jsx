import React, { useEffect, useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import '@asyncapi/react-component/styles/default.min.css';
import { parse, registerSchemaParser } from '@asyncapi/parser';
import * as openapiSchemaParser from '@asyncapi/openapi-schema-parser';
import * as avroSchemaParser from '@asyncapi/avro-schema-parser';

import * as ramlSchemaParser from '../util/raml-1-0-parser.js';
import { isValidJsonOrYaml } from '../../../utils/spec-valid-json-yaml.js';

registerSchemaParser(openapiSchemaParser);
registerSchemaParser(ramlSchemaParser);
registerSchemaParser(avroSchemaParser);

const AsyncApiReactComponent = React.lazy(() =>
  import('@asyncapi/react-component/lib/esm/without-parser.js')
);

const mapValidationErrorsToMonacoMarkers = (markers) => {
  return markers.map((marker) => {
    return {
      message: marker.title,
      startLineNumber: marker.location.startLine,
      endLineNumber: marker.location.endLine,
      startColumn: marker.location.startColumn,
      endColumn: marker.location.endColumn,
      jsonPointer: marker.location.jsonPointer,
    };
  });
};

const mapRefErrorsToMonacoMarkers = (markers, title) => {
  return markers.map((marker) => {
    return {
      message: title,
      startLineNumber: marker.startLine,
      endLineNumber: marker.endLine,
      startColumn: marker.startColumn,
      endColumn: marker.endColumn,
      jsonPointer: marker.jsonPointer,
    };
  });
};

const removeDuplicateMarkers = (list) => {
  return list.reduce((uniques, current) => {
    if (
      !uniques.some((obj) => {
        // comparing for some, but not necessarily all, object keys
        return (
          obj.message === current.message &&
          obj.startLineNumber === current.startLineNumber &&
          obj.startColumn === current.startColumn
        );
      })
    ) {
      uniques.push(current);
    }
    return uniques;
  }, []);
};

const AsyncAPIEditorPreviewPane = ({
  specSelectors,
  editorActions,
  asyncapiActions,
  asyncapiSelectors,
  getComponent,
}) => {
  const [isValid, setIsValid] = useState(false);
  const [parsedSpec, setParsedSpec] = useState(null);

  const useDebounce = (value, delay) => {
    // eslint-disable-next-line no-unused-vars
    useEffect(() => {
      const timer = setTimeout(() => {
        // first check if can load as json/yaml
        const canLoadSpec = isValidJsonOrYaml(value);
        if (!canLoadSpec) {
          setIsValid(false);
          return;
        }
        // then try parse
        parse(value)
          .then((doc) => {
            if (!doc) {
              setIsValid(false);
            } else {
              setIsValid(true);
              try {
                setParsedSpec(doc);
              } catch (e) {
                // eslint-disable-next-line no-console
                console.error('error in setParsedSpec', e);
              }
            }
          })
          .catch((e) => {
            const { validationErrors, refs, title } = e.toJS();
            let validationErrorMarkers;
            let refErrorMarkers;
            if (!validationErrors?.length > 0) {
              validationErrorMarkers = [];
            } else {
              validationErrorMarkers = mapValidationErrorsToMonacoMarkers(validationErrors);
            }
            if (!refs?.length > 0) {
              refErrorMarkers = [];
            } else {
              refErrorMarkers = mapRefErrorsToMonacoMarkers(refs, title);
            }
            const allErrorMarkers = validationErrorMarkers.concat(refErrorMarkers);
            const dedupedErrorMarkers = removeDuplicateMarkers(allErrorMarkers);
            // update reducer state
            asyncapiActions.updateAsyncApiParserMarkers(dedupedErrorMarkers);
            setIsValid(false);
          });
      }, delay);
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);
    return parsedSpec;
  };

  const getSelectorSpecStr = () => {
    const initialValue = '';
    // get spec from swagger-ui state.spec
    const spec = specSelectors.specStr();
    return spec || initialValue;
  };

  const spec = getSelectorSpecStr();
  const debouncedParsedSpec = useDebounce(spec, 500);

  const config = {
    show: {
      errors: true, // config setting to show error pane
    },
  };
  const EditorPreviewValidationPane = getComponent('AsyncApiPreviewValidationPane', true);

  if (!isValid) {
    return (
      <div className="swagger-editor__asyncapi-container">
        <EditorPreviewValidationPane
          asyncapiSelectors={asyncapiSelectors}
          onValidationClick={editorActions.setJumpToEditorMarker}
        />
      </div>
    );
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncApiReactComponent schema={debouncedParsedSpec} config={config} />
    </Suspense>
  );
};

AsyncAPIEditorPreviewPane.propTypes = {
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  asyncapiSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  asyncapiActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default AsyncAPIEditorPreviewPane;
