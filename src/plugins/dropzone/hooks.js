import { useCallback, useState } from 'react';
import { useDropzone as useVendorDropzone } from 'react-dropzone';

import { importSingleFile } from '../../utils/common-file-import-single.js';

// eslint-disable-next-line import/prefer-default-export
export const useDropzone = ({ specActions }) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0;
      const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1;

      if (someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
        const dropFileErrMessage = `Sorry, there was an error processing your file.\nPlease drag and drop exactly one OpenAPI/AsyncAPI definition in .yaml or .json format`;
        setErrorMessage(dropFileErrMessage);
        setIsAlertDialogOpen(true);
      } else {
        const file = acceptedFiles[0];
        const importedFile = await importSingleFile(file);
        if (importedFile.data && importedFile.message === 'success') {
          specActions.updateSpec(importedFile.data, 'fileDrop');
        } else {
          const importedFileErrMessage = `Sorry, there was an error processing your file. Unable to process as valid YAML or JSON `;
          setErrorMessage(importedFileErrMessage);
          setIsAlertDialogOpen(true);
        }
      }
    },
    [specActions]
  );
  const { getRootProps, getInputProps, isDragActive } = useVendorDropzone({
    onDrop: handleFileDrop,
    accept: '.yaml,application/json',
    multiple: false,
    noClick: true,
  });

  return [
    isDragActive,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    errorMessage,
    getRootProps,
    getInputProps,
  ];
};
