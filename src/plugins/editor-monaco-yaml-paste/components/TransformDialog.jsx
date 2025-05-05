import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const TransformDialog = ({
  getComponent,
  editorMonacoYAMLPasteActions,
  editorMonacoYAMLPasteSelectors,
}) => {
  const ConfirmDialog = getComponent('ConfirmDialog', true);

  const handleDialogClose = useCallback(
    (result) => {
      const text = editorMonacoYAMLPasteSelectors.selectClipboardData();
      const range = editorMonacoYAMLPasteSelectors.selectClipboardRange();

      if (result) {
        editorMonacoYAMLPasteActions.transformClipboardData({ text, range });
      }

      editorMonacoYAMLPasteActions.closeTransformDialog();
    },
    [editorMonacoYAMLPasteActions, editorMonacoYAMLPasteSelectors]
  );

  return (
    <ConfirmDialog
      isOpen={editorMonacoYAMLPasteSelectors.selectIsTransformDialogOpen()}
      title="Would you like to convert your JSON into YAML?"
      onClose={handleDialogClose}
    />
  );
};

TransformDialog.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorMonacoYAMLPasteActions: PropTypes.shape({
    transformClipboardData: PropTypes.func.isRequired,
    closeTransformDialog: PropTypes.func.isRequired,
  }).isRequired,
  editorMonacoYAMLPasteSelectors: PropTypes.shape({
    selectClipboardData: PropTypes.func.isRequired,
    selectClipboardRange: PropTypes.func.isRequired,
    selectIsTransformDialogOpen: PropTypes.func.isRequired,
  }).isRequired,
};

export default TransformDialog;
