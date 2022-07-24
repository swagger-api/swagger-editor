import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const CovertToOpenAPI30xMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const AlertDialog = getComponent('AlertDialog', true);

    const handleAlertDialogClose = () => {
      alertDialogMessage.current = '';
      setIsAlertDialogOpen(false);
    };

    useImperativeHandle(ref, () => ({
      async convert() {
        const content = editorSelectors.selectContent();
        const contentType = editorSelectors.selectIsContentFormatJSON()
          ? 'application/json'
          : 'application/yaml';

        const fsa = await editorActions.convertOpenAPI20ToOpenAPI30x({
          openAPI2Content: content,
          contentType,
        });
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

CovertToOpenAPI30xMenuItemHandler.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectContentType: PropTypes.func.isRequired,
    selectIsContentFormatJSON: PropTypes.func.isRequired,
    selectInferFileNameWithExtensionFromContent: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    convertOpenAPI20ToOpenAPI30x: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default CovertToOpenAPI30xMenuItemHandler;
