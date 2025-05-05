import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarBottomWrapper = (Original, system) => {
  const ValidationPane = system.getComponent('ValidationPane', true);

  const EditorPaneBarBottom = ({ renderChildren = identity, ...rest }) => {
    return <Original {...rest} renderChildren={() => renderChildren(<ValidationPane />)} />;
  };
  EditorPaneBarBottom.propTypes = {
    renderChildren: PropTypes.func,
  };

  return EditorPaneBarBottom;
};

export default EditorPaneBarBottomWrapper;
