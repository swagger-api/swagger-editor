import YAML from 'js-yaml';

import { getDefinitionFromUrl } from '../../utils';

export const importFromURL = ({ url }) => async (system) => {
  const data = await getDefinitionFromUrl({ url });
  if (data.error) {
    // e.g. data.error = 'Request failed with status code 404'
    return { error: data.error };
  }
  const { specActions } = system;
  // we will use swagger-ui's specActions to updateSpec
  // as well as any other apidom actions to take
  // note, in theory, we could still return an error after post-processing
  const jsContent = YAML.load(JSON.stringify(data));
  const yamlContent = YAML.dump(jsContent, { lineWidth: -1 });
  // on success,
  specActions.updateSpec(yamlContent);
  return { data: 'success' };
};

export default { importFromURL };
