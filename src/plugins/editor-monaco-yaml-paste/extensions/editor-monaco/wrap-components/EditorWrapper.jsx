/* eslint-disable react/jsx-props-no-spreading */
const EditorWrapper = (Original, system) => {
  const TransformDialog = system.getComponent('EditorMonacoYAMLTransformDialog', true);
  const Editor = ({ ...props }) => {
    return (
      <>
        <TransformDialog />
        <Original {...props} />
      </>
    );
  };

  return Editor;
};

export default EditorWrapper;
