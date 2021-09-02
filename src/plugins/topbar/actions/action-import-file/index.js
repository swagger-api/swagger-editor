import YAML from 'js-yaml';
import fileDialog from 'file-dialog';

import { isValidJson } from '../../../../utils/editor-valid-json-yaml';
import { readFileAsTextAsync } from './import-file';

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
