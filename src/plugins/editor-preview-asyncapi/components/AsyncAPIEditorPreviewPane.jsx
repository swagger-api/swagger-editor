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

const AsyncAPIEditorPreviewPane = ({ specSelectors }) => {
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
          .catch(() => {
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
  if (!isValid) {
    return (
      <div className="flex flex-1 overflow-hidden h-full justify-center items-center text-2xl mx-auto px-6 text-center">
        <p style={{ paddingLeft: '2.0rem' }}>
          Empty or invalid document. Please fix errors/define AsyncAPI document.
        </p>
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
};

export default AsyncAPIEditorPreviewPane;
