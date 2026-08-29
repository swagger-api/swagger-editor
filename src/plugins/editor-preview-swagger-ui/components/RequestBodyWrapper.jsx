import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

const RequestBodyWrapper = (Original) => {
  const RequestBody = ({ requestBody, isExecute, onChange, ...restProps }) => {
    const { onChangeIncludeEmpty } = restProps;
    const isRequired = requestBody && requestBody.get('required') === true;
    const isActive = isExecute || restProps.tryItOutEnabled;
    const showToggle = !isRequired && isActive;

    const [includeBody, setIncludeBody] = useState(true);

    const handleToggle = (e) => {
      const { checked } = e.target;
      setIncludeBody(checked);

      if (!checked) {
        if (typeof onChange === 'function') {
          onChange(undefined);
        }
        if (typeof onChangeIncludeEmpty === 'function') {
          onChangeIncludeEmpty(false);
        }
      } else if (typeof onChangeIncludeEmpty === 'function') {
        onChangeIncludeEmpty(true);
      }
    };

    return (
      <div className="swagger-editor__request-body-wrapper">
        {showToggle && (
          <label htmlFor="request-body-toggle" className="swagger-editor__request-body-toggle">
            <input
              id="request-body-toggle"
              type="checkbox"
              checked={includeBody}
              onChange={handleToggle}
            />
            <span>Send request body</span>
          </label>
        )}
        {(!showToggle || includeBody) && (
          <Original
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
            requestBody={requestBody}
            isExecute={isExecute}
            onChange={onChange}
          />
        )}
      </div>
    );
  };

  RequestBody.propTypes = {
    requestBody: ImmutablePropTypes.map,
    isExecute: PropTypes.bool,
    tryItOutEnabled: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeIncludeEmpty: PropTypes.func,
  };

  RequestBody.defaultProps = {
    requestBody: null,
    isExecute: false,
    tryItOutEnabled: false,
    onChange: () => {},
    onChangeIncludeEmpty: () => {},
  };

  return RequestBody;
};

export default RequestBodyWrapper;
