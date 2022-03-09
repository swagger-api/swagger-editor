import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, UnlockIcon } from '@primer/octicons-react';

const ReadOnlySelectionIcon = ({ editorSelectors, editorActions }) => {
  const isReadOnly = editorSelectors.selectEditorIsReadyOnly();
  const handleReadonly = (isReadOnlyNew) => () => {
    editorActions.updateEditorIsReadOnly(isReadOnlyNew);
  };

  return (
    <div>
      {!isReadOnly ? (
        <button type="button" className="btn btn-theme-icon" onClick={handleReadonly(true)}>
          <UnlockIcon size="small" aria-label="unlock icon" />
        </button>
      ) : (
        <button type="button" className="btn btn-theme-icon" onClick={handleReadonly(false)}>
          <LockIcon size="small" aria-label="lock icon" />
        </button>
      )}
    </div>
  );
};

ReadOnlySelectionIcon.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  editorSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ReadOnlySelectionIcon;
