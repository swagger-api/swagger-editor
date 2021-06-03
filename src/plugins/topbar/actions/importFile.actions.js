import YAML from 'js-yaml';
import fileDialog from 'file-dialog';

import { isValidJson } from '../../../utils/utils-valid-json-yaml';

// Wrap the browser FileReader into a Promise
const readFileAsTextAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };
    reader.readAsText(file, 'UTF-8');
  });
};

export const importFile = () => async (system) => {
  const { specActions } = system;
  const fileList = await fileDialog();
  try {
    const content = await readFileAsTextAsync(fileList.item(0));
    const preparedContent = isValidJson(content)
      ? YAML.safeDump(YAML.safeLoad(content), { lineWidth: -1 })
      : content;
    // on success,
    specActions.updateSpec(preparedContent);
    return { data: 'success' };
  } catch (e) {
    const errMessage = `Oh no! There was an error loading your document:\n\n${e.message || e}`;
    return { error: errMessage };
  }
};

export default { importFile };
