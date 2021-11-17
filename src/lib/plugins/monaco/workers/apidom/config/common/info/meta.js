import infoLints from './lint/lints';
import infoCompleteJson from './complete/json';
import infoCompleteYaml from './complete/yaml';

const infoMeta = {
  lint: infoLints,
  yaml: infoCompleteYaml,
  json: infoCompleteJson,
};

export default infoMeta;
