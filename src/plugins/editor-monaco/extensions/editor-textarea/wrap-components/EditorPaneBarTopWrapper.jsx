import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarTopWrapper = (Original, system) => {
  const ThemeSelection = system.getComponent('ThemeSelection', true);

  const EditorPaneBarTop = ({ renderControls = identity, ...rest }) => {
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

  return EditorPaneBarTop;
};

export default EditorPaneBarTopWrapper;
