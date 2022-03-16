import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, UnlockIcon } from '@primer/octicons-react';

const ReadOnlySelectionIcon = ({ editorSelectors, editorActions }) => {
  const isReadOnly = editorSelectors.selectEditorIsReadOnly();
  const handleReadonly = (isReadOnlyNew) => () => {
    editorActions.updateEditorIsReadOnly(isReadOnlyNew);
  };

  return !isReadOnly ? (
    <button
      type="button"
      className="swagger-ide__editor-pane-bar-control"
      onClick={handleReadonly(true)}
    >
      <UnlockIcon size="small" aria-label="Unlock" />
    </button>
  ) : (
    <button
      type="button"
      className="swagger-ide__editor-pane-bar-control"
      onClick={handleReadonly(false)}
    >
      <LockIcon size="small" aria-label="Lock" />
    </button>
  );
};

ReadOnlySelectionIcon.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ReadOnlySelectionIcon;
