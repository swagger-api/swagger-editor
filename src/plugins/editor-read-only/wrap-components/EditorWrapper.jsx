const EditorWrapper = (Original, system) => {
  const Editor = (props) => {
    const isReadOnly = system.editorSelectors.selectEditorIsReadOnly();

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...props} isReadOnly={isReadOnly} />;
  };

  return Editor;
};

export default EditorWrapper;
