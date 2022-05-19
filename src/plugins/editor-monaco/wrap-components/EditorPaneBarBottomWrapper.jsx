import PropTypes from 'prop-types';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarBottomWrapper = (Original, system) => {
  const ValidationPane = system.getComponent('ValidationPane', true);

  const EditorPaneBarBottom = ({ renderChildren, ...rest }) => {
    return <Original {...rest} renderChildren={() => renderChildren(<ValidationPane />)} />;
  };
  EditorPaneBarBottom.propTypes = {
    renderChildren: PropTypes.func,
  };
  EditorPaneBarBottom.defaultProps = {
    renderChildren: (children) => children,
  };

  return EditorPaneBarBottom;
};

export default EditorPaneBarBottomWrapper;
