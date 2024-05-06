import React from 'react';

const AsyncAPIReactComponent = React.lazy(
  () => import('@asyncapi/react-component/lib/esm/without-parser.js')
);

export default AsyncAPIReactComponent;
