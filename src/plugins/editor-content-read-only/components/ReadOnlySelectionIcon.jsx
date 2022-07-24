import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, UnlockIcon } from '@primer/octicons-react';

const ReadOnlySelectionIcon = ({ editorSelectors, editorActions }) => {
  const isReadWrite = editorSelectors.selectContentIsReadWrite();
  const handleReadonly = (isReadOnlyNew) => () => {
    if (isReadOnlyNew) {
      editorActions.setContentReadOnly();
    } else {
      editorActions.setContentReadWrite();
    }
  };

  return isReadWrite ? (
    <div className="swagger-editor__generic-padding-thin-top-bottom">
      <button
        type="button"
        className="swagger-editor__editor-pane-bar-control"
        onClick={handleReadonly(true)}
      >
        <UnlockIcon size="small" aria-label="Unlock" />
      </button>
    </div>
  ) : (
    <div className="swagger-editor__generic-padding-thin-top-bottom">
      <button
        type="button"
        className="swagger-editor__editor-pane-bar-control"
        onClick={handleReadonly(false)}
      >
        <LockIcon size="small" aria-label="Lock" />
      </button>
    </div>
  );
};

ReadOnlySelectionIcon.propTypes = {
  editorActions: PropTypes.shape({
    setContentReadOnly: PropTypes.func.isRequired,
    setContentReadWrite: PropTypes.func.isRequired,
  }).isRequired,
  editorSelectors: PropTypes.shape({
    selectContentIsReadWrite: PropTypes.func.isRequired,
  }).isRequired,
};

export default ReadOnlySelectionIcon;
