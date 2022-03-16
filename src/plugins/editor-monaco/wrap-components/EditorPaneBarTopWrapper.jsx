import PropTypes from 'prop-types';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarTopWrapper = (Original, system) => {
  const ThemeSelection = system.getComponent('ThemeSelection', true);
  const ValidationPane = system.getComponent('ValidationPane', true);

  const EditorPaneBarTop = ({ renderControls, renderChildren, ...rest }) => {
    return (
      <Original
        {...rest}
        renderControls={(controls) =>
          renderControls(
            <>
              <ThemeSelection />
              {controls}
            </>
          )
        }
        renderChildren={() => renderChildren(<ValidationPane />)}
      />
    );
  };
  EditorPaneBarTop.propTypes = {
    renderControls: PropTypes.func,
    renderChildren: PropTypes.func,
  };
  EditorPaneBarTop.defaultProps = {
    renderControls: (controls) => controls,
    renderChildren: (children) => children,
  };

  return EditorPaneBarTop;
};

export default EditorPaneBarTopWrapper;
