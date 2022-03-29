import fileDialog from 'file-dialog';

import { importSingleFile } from '../../../../utils/common-file-import-single.js';

export const importFile = () => async (system) => {
  const { specActions } = system;
  const fileList = await fileDialog();
  const importedFile = await importSingleFile(fileList.item(0));
  if (importedFile.data && importedFile.message === 'success') {
    specActions.updateSpec(importedFile.data);
    return { data: importFile.message };
  }
  return { error: importedFile?.error || 'unknown file import error' };
};

export default { importFile };
