import React, { useState, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const CovertToOpenAPI30xMenuItemHandler = forwardRef(
  ({ getComponent, editorSelectors, editorActions, EditorContentOrigin, getConfigs }, ref) => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const alertDialogMessage = useRef('');
    const converterURL = useMemo(
      () => getConfigs().swagger2ConverterUrl ?? editorSelectors.selectOpenAPI20ConverterURL(),
      [getConfigs, editorSelectors]
    );
    const AlertDialog = getComponent('AlertDialog', true);
    const ConfirmDialog = getComponent('ConfirmDialog', true);

    const handleAlertDialogClose = () => {
      setIsAlertDialogOpen(false);
    };

    const handleConfirmDialogClose = async (result) => {
      if (result) {
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
          setIsConfirmDialogOpen(false);
          setIsAlertDialogOpen(true);
        } else {
          editorActions.setContent(fsa.payload, EditorContentOrigin.Conversion);
          alertDialogMessage.current = '';
          setIsConfirmDialogOpen(false);
        }
      } else {
        alertDialogMessage.current = '';
        setIsConfirmDialogOpen(false);
      }
    };

    useImperativeHandle(ref, () => ({
      openModal() {
        setIsConfirmDialogOpen(true);
      },
    }));

    return (
      <>
        <AlertDialog
          isOpen={isAlertDialogOpen}
          title="Uh oh, an error has occurred"
          onClose={handleAlertDialogClose}
        >
          {alertDialogMessage.current}
        </AlertDialog>
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          title="Convert to OpenAPI 3.0.x"
          onClose={handleConfirmDialogClose}
        >
          <p>
            This feature uses the Swagger Converter API to convert your OpenAPI 2.0 definition to
            OpenAPI 3.0.x.
          </p>
          <p>
            Swagger Editor&apos;s contents will be sent to <strong>{converterURL}</strong> and
            overwritten by the conversion result.
          </p>
        </ConfirmDialog>
      </>
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
    selectOpenAPI20ConverterURL: PropTypes.func.isRequired,
  }).isRequired,
  editorActions: PropTypes.shape({
    convertOpenAPI20ToOpenAPI30x: PropTypes.func.isRequired,
    setContent: PropTypes.func.isRequired,
  }).isRequired,
  EditorContentOrigin: PropTypes.shape({
    Conversion: PropTypes.string.isRequired,
  }).isRequired,
  getConfigs: PropTypes.func.isRequired,
};

export default CovertToOpenAPI30xMenuItemHandler;
