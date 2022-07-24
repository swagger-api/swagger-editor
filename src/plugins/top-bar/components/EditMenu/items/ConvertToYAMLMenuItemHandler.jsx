import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const CovertToYAMLMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async convertToYAML() {
        const content = editorSelectors.selectContent();

        const fsa = await editorActions.convertContentToYAML(content);
        if (fsa.error) {
          alertDialogMessage.current = fsa.meta.errorMessage;
          setIsAlertDialogOpen(true);
          return;
        }

        editorActions.setContent(fsa.payload, 'conversion');
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

CovertToYAMLMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectInferFileNameWithExtensionFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    convertContentToYAML: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default CovertToYAMLMenuItemHandler;
