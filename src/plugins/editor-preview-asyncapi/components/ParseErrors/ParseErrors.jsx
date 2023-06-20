const ParseErrors = () => {
  return (
    <div className="swagger-editor__editor-preview-asyncapi-parse-errors">
      <div className="swagger-ui">
        <div className="version-pragma">
          <div className="version-pragma__message version-pragma__message--missing">
            <div>
              <h3>Invalid AsyncAPI definition.</h3>
              <p>
                The provided AsyncAPI definition is not valid. Please check your syntax, and correct
                any discrepancies to ensure it adheres to the AsyncAPI standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParseErrors;
