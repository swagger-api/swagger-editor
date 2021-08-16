import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function EditMenuDropdownHooks(props) {
  const { getComponent, topbarActions } = props;
  const [languageFormat, setLanguageFormat] = useState('json');

  useEffect(() => {
    // let isMounted = true;
    const getDefinitionLanguageFormat = async () => {
      const result = await topbarActions.getDefinitionLanguageFormat();
      if (result.languageFormat) {
        setLanguageFormat(result.languageFormat);
      }
    };
    // call the async/await function
    getDefinitionLanguageFormat();
    // cleanup on unmount
    // return () => {
    //   isMounted = false;
    // };
  }, [languageFormat, topbarActions]);

  useEffect(() => {
    const shouldUpdateDefinitionLanguageFormat = async () => {
      const result = await topbarActions.shouldUpdateDefinitionLanguageFormat({
        languageFormat,
      });
      if (result.shouldUpdate && result.languageFormat !== languageFormat) {
        setLanguageFormat(result.languageFormat);
      }
    };
    // call the async/await function
    shouldUpdateDefinitionLanguageFormat();
  });

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

  const onConvertToYamlClick = () => {
    async function convertToYaml() {
      const convertedResult = await topbarActions.convertToYaml();
      if (convertedResult && convertedResult.error) {
        // display the error message
      }
    }
    // call the async/await function
    convertToYaml();
  };
  const onConvertToOas3Click = () => {
    async function convertDefinitionToOas3() {
      const convertedResult = await topbarActions.convertDefinitionToOas3();
      if (convertedResult && convertedResult.error) {
        // display the error message
      }
    }
    // call the async/await function
    convertDefinitionToOas3();
  };

  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');

  return (
    <DropdownMenu displayName="hook">
      {languageFormat !== 'yaml' ? (
        <DropdownItem onClick={() => onConvertToYamlClick()} name="Convert To YAML" />
      ) : null}
      {allowConvertDefinitionToOas3 ? (
        <DropdownItem onClick={() => onConvertToOas3Click()} name="Convert To OpenAPI 3" />
      ) : null}
    </DropdownMenu>
  );
}

EditMenuDropdownHooks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
