import fileDialog from 'file-dialog';
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
      try {
        const [file] = await fileDialog({ multiple: false });
        const content = await file.text();

        editorActions.setContent(content, 'import-file');
      } catch (error) {
        alertDialogMessage.current = error.message || 'Unknown error while reading uploaded file.';
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
    setContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default ImportFileMenuItemHandler;
