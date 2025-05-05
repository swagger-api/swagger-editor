import PropTypes from 'prop-types';
import identity from 'lodash/identity.js';
/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneBarTopWrapper = (Original, system) => {
  const ReadOnlySelection = system.getComponent('ReadOnlySelection', true);
  const EditorPaneBarTop = ({ renderControls = identity, ...rest }) => {
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

  return EditorPaneBarTop;
};

export default EditorPaneBarTopWrapper;
