import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useLanguageFormat } from './shared-hooks';

export default function EditMenuDropdownHooks(props) {
  const { getComponent, topbarActions } = props;
  const languageFormat = useLanguageFormat(topbarActions);

  const [allowConvertDefinitionToOas3, setAllowConvertDefinitionToOas3] = useState(false);
  useEffect(() => {
    const checkAllowConvertDefinitionToOas3 = async () => {
      const bool = await topbarActions.allowConvertDefinitionToOas3();
      if (bool !== allowConvertDefinitionToOas3) {
        setAllowConvertDefinitionToOas3(bool);
      }
    };
    checkAllowConvertDefinitionToOas3();
  });

  const handleConvertToYamlClick = () => {
    async function convertToYaml() {
      const convertedResult = await topbarActions.convertToYaml();
      if (convertedResult && convertedResult.error) {
        // may display the error message
      }
    }
    // call the async/await function
    convertToYaml();
  };

  const handleConvertToOas3Click = () => {
    async function convertDefinitionToOas3() {
      const convertedResult = await topbarActions.convertDefinitionToOas3();
      if (convertedResult && convertedResult.error) {
        // may display the error message
      }
    }
    // call the async/await function
    convertDefinitionToOas3();
  };

  const handleClearEditorClick = () => {
    async function clearEditor() {
      // note: in actions, we detect the spec language in order to "clear" with a minimal supported spec
      const clearResult = await topbarActions.clearEditor();
      if (clearResult && clearResult.error) {
        // should not occur
        // may display the error message
      }
    }
    clearEditor();
  };

  const handleLoadDefaultDefinition = (language) => {
    async function loadDefaultDefinition() {
      const loadResult = await topbarActions.loadDefaultDefinition(language);
      if (loadResult && loadResult.error) {
        // may display the error message
      }
    }
    // call the async/await function
    loadDefaultDefinition(language);
  };

  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.code) {
        case 'F8':
          handleLoadDefaultDefinition('oas3');
          break;
        case 'F7':
          handleLoadDefaultDefinition('asyncapi2');
          break;
        case 'F6':
          handleLoadDefaultDefinition('oas3_1');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown, true);
    // cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleKeydown, true);
    };
  });

  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');

  return (
    <DropdownMenu displayName="Editor">
      <DropdownItem onClick={() => handleClearEditorClick()} name="Clear Editor" />
      <li role="separator" />
      {languageFormat !== 'yaml' ? (
        <DropdownItem onClick={() => handleConvertToYamlClick()} name="Convert To YAML" />
      ) : null}
      {allowConvertDefinitionToOas3 ? (
        <DropdownItem onClick={() => handleConvertToOas3Click()} name="Convert To OpenAPI 3" />
      ) : null}
      {languageFormat !== 'yaml' || allowConvertDefinitionToOas3 ? <li role="separator" /> : null}
      <DropdownItem
        onClick={() => handleLoadDefaultDefinition('oas3')}
        name="Load Default OAS3.0"
      />
      <DropdownItem
        onClick={() => handleLoadDefaultDefinition('oas3_1')}
        name="Load Default OAS3.1"
      />
      <DropdownItem
        onClick={() => handleLoadDefaultDefinition('oas2')}
        name="Load Default OAS2.0"
      />
      <DropdownItem
        onClick={() => handleLoadDefaultDefinition('asyncapi2')}
        name="Load Default AsyncAPI 2.0"
      />
    </DropdownMenu>
  );
}

EditMenuDropdownHooks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
