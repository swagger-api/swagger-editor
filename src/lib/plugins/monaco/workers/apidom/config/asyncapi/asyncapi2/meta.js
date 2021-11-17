import asyncapiRootLints from './lint/lints';
import asyncapiRootCompleteYaml from './complete/yaml';
import asyncapiRootCompleteJson from './complete/json';

const asyncapi2Meta = {
  lint: asyncapiRootLints,
  yaml: asyncapiRootCompleteYaml,
  json: asyncapiRootCompleteJson,
};

export default asyncapi2Meta;
