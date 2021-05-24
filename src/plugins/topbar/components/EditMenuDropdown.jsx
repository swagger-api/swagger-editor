// If we need to later, we can migrate this file as a separate file,
// and define this index as a plugin wrapper
import React from 'react';
import PropTypes from 'prop-types';

export default function EditMenuDropdown(props) {
  const onConvertToOas3Click = async () => {
    // ref legacy method: topbarActions.showModal("convert")
    const { topbarActions } = props;
    const convertedResult = await topbarActions.convertDefinitionToOas3();
    if (convertedResult && convertedResult.error) {
      // display the error message
    }
  };

  const onConvertToYamlClick = async () => {
    // ref legacy method: convertToYaml
    const { topbarActions } = props;
    const convertedResult = await topbarActions.convertToYaml();
    if (convertedResult && convertedResult.error) {
      // display the error message
    }
  };

  const { getComponent } = props;
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');
  // Todo: render convert to OAS3 only if currently 'isSwagger2`, which we can get from specSelectors.isSwagger2()
  // note: convert method still works on an OAS3 definition, so this is strictly a UX/UI issue
  // Todo: implement Modal progress/status? Imo, a "success" message not needed b/c user
  // will see UI update, but consult UX
  return (
    <DropdownMenu displayName="Edit">
      <DropdownItem onClick={() => onConvertToYamlClick()} name="Convert To YAML" />
      <DropdownItem onClick={() => onConvertToOas3Click()} name="Convert To OpenAPI 3" />
    </DropdownMenu>
  );
}

EditMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
