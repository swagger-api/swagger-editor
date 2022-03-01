import React from 'react';
import PropTypes from 'prop-types';

import { useDefinitionLanguage } from '../shared-hooks.js';

const EditorPreviewPaneWrapper = (Original, system) => {
  const EditorPreviewPane = ({ getComponent, asyncapiActions }) => {
    const definitionLanguage = useDefinitionLanguage(asyncapiActions);
    const AsyncApiComponent = getComponent('AsyncAPIEditorPreviewPane', true);

    return (
      <>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {definitionLanguage === 'oas' && <Original {...system} />}
        {definitionLanguage === 'asyncapi2' && <AsyncApiComponent />}
      </>
    );
  };

  EditorPreviewPane.propTypes = {
    getComponent: PropTypes.func.isRequired,
    asyncapiActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  };

  return EditorPreviewPane;
};

export default EditorPreviewPaneWrapper;
