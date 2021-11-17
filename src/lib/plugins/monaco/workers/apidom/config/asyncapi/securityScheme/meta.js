import securitySchemeLints from './lint/lints';
import securitySchemeTypeCompleteYaml from './complete/yaml';
import securitySchemeTypeCompleteJson from './complete/json';

const securitySchemeMeta = {
  lint: securitySchemeLints,
  yaml: securitySchemeTypeCompleteYaml,
  json: securitySchemeTypeCompleteJson,
};

export default securitySchemeMeta;
