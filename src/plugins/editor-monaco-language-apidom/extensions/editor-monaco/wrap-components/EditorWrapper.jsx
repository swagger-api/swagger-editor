/* eslint-disable react/jsx-props-no-spreading */
const EditorWrapper =
  ({ useApiDOMSyntaxHighlighting = false }) =>
  (Original) => {
    const Editor = ({ ...props }) => {
      return <Original {...props} bracketPairColorizationEnabled={useApiDOMSyntaxHighlighting} />;
    };

    return Editor;
  };

export default EditorWrapper;
