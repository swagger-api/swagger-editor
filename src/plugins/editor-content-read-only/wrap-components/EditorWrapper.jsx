const EditorWrapper = (Original, system) => {
  const Editor = (props) => {
    const isReadOnly = system.editorSelectors.selectContentIsReadOnly();

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Original {...props} isReadOnly={isReadOnly} />;
  };

  return Editor;
};

export default EditorWrapper;
