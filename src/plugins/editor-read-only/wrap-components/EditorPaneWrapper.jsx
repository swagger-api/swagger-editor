const EditorPaneWrapper = (Original, system) => {
  const EditorPane = (props) => {
    const isReadOnly = system.editorSelectors.selectEditorIsReadyOnly();

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...props} isReadOnly={isReadOnly} />;
  };

  return EditorPane;
};

export default EditorPaneWrapper;
