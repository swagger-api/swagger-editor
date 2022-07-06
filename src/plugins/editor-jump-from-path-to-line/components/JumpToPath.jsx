import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import JumpIcon from './jump-icon.svg';

/**
 * Todo: verify if still required to replace legacy shouldComponentUpdate with React.memo ['content','showButton','path','specPath']
 */

// legacy name that is already built into SwaggerUI
// render svg icon in SwaggerUI
// onClick of svg icon => jump to line in editor
// eslint-disable-next-line no-unused-vars
const JumpToPath = ({ specSelectors, editorActions, path, specPath, content, showButton }) => {
  const handleJumpToEditorLine = (e) => {
    e.stopPropagation();
    console.log('inside handleJumpToEditorLine');
    // console.log('checking props... path:', path, ' | specPath:', specPath, ' | content:', content);
    // List, array[], null
    // console.log('...path.toJS:', path.toJS());
    // ['paths', '/test', 'get']
    const jumpPath = specSelectors.bestJumpPath(path);
    console.log('jumpPath:', jumpPath);
    // '/paths/test/get'
    // TODO: NYI
    // note: apidom-ls will expect a String instead of legacy Array, e.g. '/components/schemas/Category/properties/id',
    // const markerPosition = specSelectors.getSpecLineFromPath(jumpPath);
    // from `editor-monaco` plugin
    // editorActions.setJumpToEditorMarker(markerPosition);
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
