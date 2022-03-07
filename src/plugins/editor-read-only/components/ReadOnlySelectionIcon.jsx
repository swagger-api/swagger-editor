import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, UnlockIcon } from '@primer/octicons-react';

const defaultReadOnlyStatus = 'false';

const ReadOnlySelectionIcon = ({ editorSelectors, editorActions }) => {
  const isReadOnly = editorSelectors.getEditorIsReadyOnly() || defaultReadOnlyStatus;
  const handleChange = (newStatus) => () => {
    if (newStatus === 'true' || newStatus === 'false') {
      editorActions.updateEditorIsReadOnly(newStatus);
    }
  };

  return (
    <div>
      {isReadOnly !== 'true' ? (
        <button type="button" className="btn btn-theme-icon" onClick={handleChange('true')}>
          <UnlockIcon size="small" aria-label="unlock icon" />
        </button>
      ) : (
        <button type="button" className="btn btn-theme-icon" onClick={handleChange('false')}>
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
