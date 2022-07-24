import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const ConvertAndSaveAsJSONMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async convertAndSaveAsJSON() {
        const content = editorSelectors.selectContent();
        const fileName = editorSelectors.selectInferFileNameFromContent();
        const fileNameWithExtension = `${fileName}.json`;

        const convertFSA = await editorActions.convertContentToJSON(content);
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

ConvertAndSaveAsJSONMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectInferFileNameFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    convertContentToJSON: PropTypes.func.isRequired,
    downloadContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default ConvertAndSaveAsJSONMenuItemHandler;
