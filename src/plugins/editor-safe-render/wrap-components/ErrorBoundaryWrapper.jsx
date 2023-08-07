import React from 'react';

import ErrorBoundary from '../components/ErrorBoundary.jsx';

const ErrorBoundaryWrapper = (Original, system) => {
  const ErrorBoundaryOverride = (props) => {
    const { editorSelectors } = system;

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <ErrorBoundary {...props} editorSelectors={editorSelectors} />;
  };

  return ErrorBoundaryOverride;
};

export default ErrorBoundaryWrapper;
