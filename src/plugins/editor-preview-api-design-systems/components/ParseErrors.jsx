import PropTypes from 'prop-types';

const ParseErrors = ({ error }) => {
  return (
    <div className="swagger-editor__editor-preview-api-design-systems-parse-errors">
      <div className="swagger-ui">
        <div className="version-pragma">
          <div className="version-pragma__message version-pragma__message--missing">
            <div>
              <h3>Invalid API Design Systems definition.</h3>
              <p>Please fix the error: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ParseErrors.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }).isRequired,
};

export default ParseErrors;
