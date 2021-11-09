import contactLints from './lint/lints';
import contactCompleteYaml from './complete/yaml';
import contactCompleteJson from './complete/json';

const contactMeta = {
  lint: contactLints,
  yaml: contactCompleteYaml,
  json: contactCompleteJson,
};

export default contactMeta;
