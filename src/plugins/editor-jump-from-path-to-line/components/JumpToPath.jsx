import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import JumpIcon from './jump-icon.svg';

/**
 * JumpToPath is a legacy name that is already built into SwaggerUI
 * 1. onHover of SwaggerUI operation or model, render svg icon
 * 2. onClick of svg icon => jump to line in editor
 */

const JumpToPath = ({ specSelectors, editorActions, path, specPath, content, showButton }) => {
  const handleJumpToEditorLine = (e) => {
    e.stopPropagation();
    const jumpPath = specSelectors.bestJumpPath({ path, specPath });
    // `apidom-ls` will expect `jumpPath` to be a String instead of legacy Array, e.g. '/components/schemas/Category/properties/id'
    // `Editor` will handle the rest of workflow
    editorActions.setRequestJumpToEditorMarker({ jsonPointer: jumpPath });
  };

  const defaultJumpButton = (
    <div
      role="button"
      tabIndex={0}
      onClick={handleJumpToEditorLine}
      onKeyPress={handleJumpToEditorLine}
    >
      <img src={JumpIcon} className="view-line-link" title="Jump to definition" alt="" />
    </div>
  );

  if (content) {
    // if we were given content to render, wrap it
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={handleJumpToEditorLine}
        onKeyPress={handleJumpToEditorLine}
      >
        {showButton ? { defaultJumpButton } : null}
        {content}
      </span>
    );
  }
  return <div>{defaultJumpButton}</div>;
};

JumpToPath.propTypes = {
  editorActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  specSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string, ImmutablePropTypes.list]),
  specPath: PropTypes.oneOfType([PropTypes.array, ImmutablePropTypes.list]), // the location within the spec. used as a fallback if `path` doesn't exist
  content: PropTypes.element,
  showButton: PropTypes.bool,
};

JumpToPath.defaultProps = {
  path: [],
  specPath: [],
  content: null,
  showButton: false,
};

export default JumpToPath;
