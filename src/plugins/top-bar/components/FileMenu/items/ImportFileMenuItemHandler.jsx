import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const ImportFileMenuItemHandler = forwardRef(({ getComponent, editorActions }, ref) => {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const alertDialogMessage = useRef('');
  const AlertDialog = getComponent('AlertDialog', true);

  const handleAlertDialogClose = () => {
    alertDialogMessage.current = '';
    setIsAlertDialogOpen(false);
  };

  useImperativeHandle(ref, () => ({
    async openFileDialog() {
      const fsa = await editorActions.uploadFile();

      if (fsa.error) {
        alertDialogMessage.current =
          fsa.error.message || 'Unknown error while reading uploaded file.';
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
});

ImportFileMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorActions: PropTypes.shape({
    uploadFile: PropTypes.func.isRequired,
  }).isRequired,
};

export default ImportFileMenuItemHandler;
