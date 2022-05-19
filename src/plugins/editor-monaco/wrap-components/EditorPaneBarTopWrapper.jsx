import PropTypes from 'prop-types';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarTopWrapper = (Original, system) => {
  const ThemeSelection = system.getComponent('ThemeSelection', true);

  const EditorPaneBarTop = ({ renderControls, ...rest }) => {
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
      />
    );
  };
  EditorPaneBarTop.propTypes = {
    renderControls: PropTypes.func,
  };
  EditorPaneBarTop.defaultProps = {
    renderControls: (controls) => controls,
  };

  return EditorPaneBarTop;
};

export default EditorPaneBarTopWrapper;
