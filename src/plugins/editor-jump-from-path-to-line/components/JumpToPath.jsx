/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import JumpIcon from './jump-icon.svg';

/**
 * Todo: still required to replace legacy shouldComponentUpdate with React.memo
 * Todo: verify if actually need immutableJS dependency. atm, only need the proptypes
 */

// legacy name that is already built into SwaggerUI
// render svg icon in SwaggerUI
// onClick of svg icon => jump to line in editor
// eslint-disable-next-line no-unused-vars
const JumpToPath = ({ specSelectors, editorActions, path, specPath, content, showButton }) => {
  const handleJumpToEditorLine = (e) => {
    e.stopPropagation();
    console.log('inside handleJumpToEditorLine');
    console.log('checking props... path:', path, ' | specPath:', specPath, ' | content:', content);
    // List, array[], null
    // const jumpPath = specSelectors.bestJumpPath({ path, specPath });
    // editorActions.setJumpToEditorMarker(jumpPath);
  };

  const defaultJumpButton = (
    <img
      src={JumpIcon}
      onClick={handleJumpToEditorLine}
      className="view-line-link"
      title="Jump to definition"
    />
  );

  if (content) {
    // if we were given content to render, wrap it
    return (
      <span onClick={handleJumpToEditorLine}>
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
  specPath: PropTypes.oneOfType([PropTypes.array]), // the location within the spec. used as a fallback if `path` doesn't exist
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
