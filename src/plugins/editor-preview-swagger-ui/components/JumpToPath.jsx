import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import JumpIcon from '../assets/jump-icon.svg';

const JumpToPath = ({ path, content, showButton, editorPreviewSwaggerUIActions }) => {
  const handleJumpToPath = (e) => {
    e.stopPropagation();
    editorPreviewSwaggerUIActions.jumpToPath(path.toJS());
  };

  const jumpToPathButton = (
    <div role="button" tabIndex={0} onClick={handleJumpToPath} onKeyDown={handleJumpToPath}>
      <img
        src={JumpIcon}
        className="view-line-link"
        title="Jump to definition"
        alt="Jump to path"
      />
    </div>
  );

  if (content) {
    // if we were given content to render, wrap it
    return (
      <span role="button" tabIndex={0} onClick={handleJumpToPath} onKeyDown={handleJumpToPath}>
        {showButton && jumpToPathButton}
        {content}
      </span>
    );
  }
  return <div>{jumpToPathButton}</div>;
};

JumpToPath.propTypes = {
  path: ImmutablePropTypes.listOf(PropTypes.string),
  content: PropTypes.element,
  showButton: PropTypes.bool,
  editorPreviewSwaggerUIActions: PropTypes.shape({
    jumpToPath: PropTypes.func.isRequired,
  }).isRequired,
};

JumpToPath.defaultProps = {
  path: List(),
  content: null,
  showButton: false,
};

export default JumpToPath;
