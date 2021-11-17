import asyncapiVersionCompleteYaml from './complete/yaml';
import asyncapiVersionLints from './lint/lints';
import asyncapiVersionCompleteJson from './complete/json';

const asyncApiVersionMeta = {
  lint: asyncapiVersionLints,
  yaml: asyncapiVersionCompleteYaml,
  json: asyncapiVersionCompleteJson,
};

export default asyncApiVersionMeta;
