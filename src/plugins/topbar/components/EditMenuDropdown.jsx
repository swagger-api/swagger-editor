import React from 'react';
import PropTypes from 'prop-types';

export default function EditMenuDropdown(props) {
  const handleConvertToOas3Click = async () => {
    const { topbarActions } = props;
    const convertedResult = await topbarActions.convertDefinitionToOas3();
    if (convertedResult && convertedResult.error) {
      // may display the error message
    }
  };

  const handleConvertToYamlClick = async () => {
    const { topbarActions } = props;
    const convertedResult = await topbarActions.convertToYaml();
    if (convertedResult && convertedResult.error) {
      // may display the error message
    }
  };

  const { getComponent } = props;
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');
  // Todo: render convert to OAS3 only if currently 'isSwagger2`, which we can get from specSelectors.isSwagger2()
  // Note, the "hooks" version has this implemented
  return (
    <DropdownMenu displayName="Edit">
      <DropdownItem onClick={() => handleConvertToYamlClick()} name="Convert To YAML" />
      <DropdownItem onClick={() => handleConvertToOas3Click()} name="Convert To OpenAPI 3" />
    </DropdownMenu>
  );
}

EditMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
