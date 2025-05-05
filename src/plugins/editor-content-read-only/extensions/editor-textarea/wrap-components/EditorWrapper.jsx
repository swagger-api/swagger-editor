import { useEffect } from 'react';
import PropTypes from 'prop-types';

const EditorWrapper = (Original, system) => {
  /**
   * `isReadOnly` prop has always priority over the state.
   * If `isReadOnly` prop is set, it will override the state.
   */
  const Editor = ({ isReadOnly: isReadOnlyFromProp = null, ...props }) => {
    const isReadOnlyFromState = system.editorSelectors.selectContentIsReadOnly();
    const isReadOnly = isReadOnlyFromProp ?? isReadOnlyFromState;

    useEffect(() => {
      if (typeof isReadOnlyFromProp === 'boolean' && isReadOnlyFromProp !== isReadOnlyFromState) {
        if (isReadOnlyFromProp) system.editorActions.setContentReadOnly();
        if (!isReadOnlyFromProp) system.editorActions.setContentReadWrite();
      }
    }, [isReadOnlyFromProp, isReadOnlyFromState]);

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...props} isReadOnly={isReadOnly} />;
  };

  Editor.propTypes = {
    isReadOnly: PropTypes.bool,
  };

  return Editor;
};

export default EditorWrapper;
