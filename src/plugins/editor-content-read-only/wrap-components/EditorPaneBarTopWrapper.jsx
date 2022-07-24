import PropTypes from 'prop-types';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarTopWrapper = (Original, system) => {
  const ReadOnlySelection = system.getComponent('ReadOnlySelection', true);
  const EditorPaneBarTop = ({ renderControls, ...rest }) => {
    return (
      <Original
        {...rest}
        renderControls={(controls) =>
          renderControls(
            <>
              <ReadOnlySelection />
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
