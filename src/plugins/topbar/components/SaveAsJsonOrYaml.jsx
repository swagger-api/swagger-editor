import React from 'react';
import PropTypes from 'prop-types';

const SaveAsJsonOrYaml = ({
  getComponent,
  languageFormat,
  onSaveAsJsonClick,
  onSaveAsYamlClick,
}) => {
  const DropdownItem = getComponent('DropdownItem');

  return (
    <div>
      {languageFormat !== 'json' ? null : (
        <DropdownItem onClick={() => onSaveAsJsonClick()} name="Save (as JSON)" />
      )}
      {languageFormat !== 'json' ? null : (
        <DropdownItem onClick={() => onSaveAsYamlClick()} name="Convert and save as YAML" />
      )}
      {languageFormat !== 'yaml' ? null : (
        <DropdownItem onClick={() => onSaveAsYamlClick()} name="Save (as YAML)" />
      )}
      {languageFormat !== 'yaml' ? null : (
        <DropdownItem onClick={() => onSaveAsJsonClick()} name="Convert and save as JSON" />
      )}
    </div>
  );
};

SaveAsJsonOrYaml.propTypes = {
  getComponent: PropTypes.func.isRequired,
  languageFormat: PropTypes.string.isRequired,
  onSaveAsJsonClick: PropTypes.func.isRequired,
  onSaveAsYamlClick: PropTypes.func.isRequired,
};

export default SaveAsJsonOrYaml;
