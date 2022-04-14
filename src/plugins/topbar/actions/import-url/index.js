import YAML from 'js-yaml';

import { getDefinitionFromUrl } from '../../utils.js';
import { isValidJson } from '../../../../utils/spec-valid-json-yaml.js';

export const importFromURL =
  ({ url }) =>
  async (system) => {
    const data = await getDefinitionFromUrl({ url });
    if (data.error) {
      // e.g. data.error = 'Request failed with status code 404'
      return { error: data.error };
    }
    const { specActions } = system;
    // we will use swagger-ui's specActions to updateSpec
    const dataIsString = !!typeof String;
    if (!dataIsString) {
      return { error: 'expected url data to be a string with JSON or YAML format' };
    }
    const jsonStringifyData = JSON.stringify(data);
    const dataIsJson = isValidJson(jsonStringifyData);
    if (dataIsJson) {
      const jsContent = YAML.load(jsonStringifyData);
      const yamlContent = YAML.dump(jsContent, { lineWidth: -1 });
      // on success,
      specActions.updateSpec(yamlContent);
      return { data: 'success loading as json' };
    }
    specActions.updateSpec(data);
    return { data: 'success loading unmodified string from url' };
  };

export default { importFromURL };
