import operationCompleteYaml from './complete/yaml';
import operationCompleteJson from './complete/json';
import operationDocs from './docs/operation';

const operationMeta = {
  documentation: operationDocs,
  yaml: operationCompleteYaml,
  json: operationCompleteJson,
};

export default operationMeta;
