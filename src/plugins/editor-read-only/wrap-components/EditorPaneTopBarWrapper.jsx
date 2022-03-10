/* eslint-disable react/jsx-props-no-spreading */

const EditorPaneTopBarWrapper = (Original, system) => {
  const ReadOnlySelection = system.getComponent('ReadOnlySelection', true);

  const EditorPaneTopBar = (props) => {
    return (
      <Original
        {...props}
        renderControls={(controls) => (
          <>
            {controls}
            <ReadOnlySelection />
          </>
        )}
      />
    );
  };

  return EditorPaneTopBar;
};

export default EditorPaneTopBarWrapper;
