import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const DownloadResolvedYAMLMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async downloadResolvedYAML() {
        const content = editorSelectors.selectContent();
        const fileName = editorSelectors.selectInferFileNameFromContent();
        const fileExtension = '.yaml';
        const fileNameWithExtension = `${fileName}${fileExtension}`;

        const dereferenceFSA = await editorActions.dereferenceContent({ content, fileExtension });
        if (dereferenceFSA.error) {
          alertDialogMessage.current = dereferenceFSA.meta.errorMessage;
          setIsAlertDialogOpen(true);
          return;
        }

        const convertFSA = await editorActions.convertContentToYAML(dereferenceFSA.payload);
        if (convertFSA.error) {
          alertDialogMessage.current = convertFSA.meta.errorMessage;
          setIsAlertDialogOpen(true);
          return;
        }

        const downloadFSA = await editorActions.downloadContent({
          content: convertFSA.payload,
          fileNameWithExtension,
        });
        if (downloadFSA.error) {
          alertDialogMessage.current = downloadFSA.meta.errorMessage;
          setIsAlertDialogOpen(true);
        }
      },
    }));

    return (
      <AlertDialog
        isOpen={isAlertDialogOpen}
        title="Uh oh, an error has occurred"
        onClose={handleAlertDialogClose}
      >
        {alertDialogMessage.current}
      </AlertDialog>
    );
  }
);

DownloadResolvedYAMLMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectInferFileNameFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    dereferenceContent: PropTypes.func.isRequired,
    convertContentToYAML: PropTypes.func.isRequired,
    downloadContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default DownloadResolvedYAMLMenuItemHandler;
