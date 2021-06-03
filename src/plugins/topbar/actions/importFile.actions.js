import YAML from 'js-yaml';
import fileDialog from 'file-dialog';
import isJsonObject from 'is-json';

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
    const preparedContent = isJsonObject(content) ? YAML.safeDump(YAML.safeLoad(content)) : content;
    // on success,
    specActions.updateSpec(preparedContent);
    return { data: 'success' };
  } catch (e) {
    const errMessage = `Oh no! There was an error loading your document:\n\n${e.message || e}`;
    return { error: errMessage };
  }
};

export default { importFile };
