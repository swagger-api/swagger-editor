import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const DownloadResolvedJSONMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async downloadResolvedJSON() {
        const content = editorSelectors.selectContent();
        const fileName = editorSelectors.selectInferFileNameFromContent();
        const fileExtension = '.json';
        const fileNameWithExtension = `${fileName}${fileExtension}`;

        const dereferenceFSA = await editorActions.dereferenceContent({ content });
        if (dereferenceFSA.error) {
          alertDialogMessage.current = dereferenceFSA.meta.errorMessage;
          setIsAlertDialogOpen(true);
          return;
        }

        const convertFSA = await editorActions.convertContentToJSON(dereferenceFSA.payload);
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

DownloadResolvedJSONMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectInferFileNameFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    dereferenceContent: PropTypes.func.isRequired,
    convertContentToJSON: PropTypes.func.isRequired,
    downloadContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default DownloadResolvedJSONMenuItemHandler;
