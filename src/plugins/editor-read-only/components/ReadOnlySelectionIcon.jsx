import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, UnlockIcon } from '@primer/octicons-react';

const ReadOnlySelectionIcon = ({ editorSelectors, editorActions }) => {
  const isReadOnly = editorSelectors.selectEditorIsReadOnly();
  const handleReadonly = (isReadOnlyNew) => () => {
    editorActions.updateEditorIsReadOnly(isReadOnlyNew);
  };

  return !isReadOnly ? (
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
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ReadOnlySelectionIcon;
