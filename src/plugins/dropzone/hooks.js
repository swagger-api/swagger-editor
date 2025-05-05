import { useCallback, useState } from 'react';
import { useDropzone as useVendorDropzone } from 'react-dropzone';

// eslint-disable-next-line import/prefer-default-export
export const makeUseDropzone = (getSystem) => () => {
  const { editorDropzoneActions } = getSystem();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0;
      const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1;

      if (someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
        const dropFileErrMessage = `Sorry, there was an error processing your file.\nPlease drag and drop exactly one file.`;
        setErrorMessage(dropFileErrMessage);
        setIsAlertDialogOpen(true);
      } else {
        const fsa = await editorDropzoneActions.dropFile({ file: acceptedFiles[0] });

        if (fsa.error) {
          const importedFileErrMessage = `Sorry, there was an error processing your file. Unable to process as valid YAML or JSON `;
          setErrorMessage(importedFileErrMessage);
          setIsAlertDialogOpen(true);
        }
      }
    },
    [setErrorMessage, setIsAlertDialogOpen, editorDropzoneActions]
  );
  const { getRootProps, getInputProps, isDragActive } = useVendorDropzone({
    onDrop: handleFileDrop,
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
