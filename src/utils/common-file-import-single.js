import YAML from 'js-yaml';

import { isValidJson } from './spec-valid-json-yaml.js';
import { readFileAsTextAsync } from './common-file-read-as-text-async.js';

export const importSingleFile = async (singleFile) => {
  try {
    const content = await readFileAsTextAsync(singleFile);
    const preparedContent = isValidJson(content)
      ? YAML.dump(YAML.load(content), { lineWidth: -1 })
      : content;
    // on success,
    return Promise.resolve({ message: 'success', data: preparedContent });
  } catch (e) {
    const errMessage = `Oh no! There was an error loading your document:\n\n${e.message || e}`;
    return Promise.resolve({ error: errMessage });
  }
};

export default { importSingleFile };
