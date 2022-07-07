import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const SaveAsMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async downloadContent() {
        const content = editorSelectors.selectContent();
        const fileNameWithExtension = editorSelectors.selectInferFileNameWithExtensionFromContent();

        const fsa = await editorActions.downloadContent({
          content,
          fileNameWithExtension,
        });
        if (fsa.error) {
          alertDialogMessage.current = fsa.meta.errorMessage;
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

SaveAsMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectInferFileNameWithExtensionFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    downloadContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default SaveAsMenuItemHandler;
