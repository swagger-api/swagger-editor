import YAML from 'js-yaml';
import isJsonObject from 'is-json';

// this is more robust than utils-converter.getDefinitionLanguage
export const isValidJson = (str) => {
  try {
    return isJsonObject(str);
  } catch (e) {
    return false;
  }
};

export const isValidYaml = (str) => {
  if (!isValidJson(str)) {
    return false;
  }
  try {
    // eslint-disable-next-line no-unused-vars
    const yamlString = YAML.safeDump(YAML.safeLoad(str), { lineWidth: -1 }); // will throw on error
    return true;
  } catch (e) {
    return false;
  }
};

export default { isValidJson, isValidYaml };
