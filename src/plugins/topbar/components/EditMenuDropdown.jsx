// This is a React.Component container of dropdownItems
// no special list handling; all "clicks" pass props in same format
// If we need to later, we can migrate this file as a separate file,
// and define this index as a plugin wrapper
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class EditMenuDropdown extends Component {
  onConvertToOas3Click = async () => {
    // ref legacy method: topbarActions.showModal("convert")
    const { topbarActions } = this.props;

    const convertedResult = await topbarActions.convertDefinitionToOas3();
    if (convertedResult && convertedResult.error) {
      // display the error message
    }
  };

  onConvertToYamlClick = async () => {
    // ref legacy method: convertToYaml
    const { topbarActions } = this.props;
    const convertedResult = await topbarActions.convertToYaml();
    if (convertedResult && convertedResult.error) {
      // display the error message
    }
  };

  render() {
    const { getComponent } = this.props;
    const DropdownMenu = getComponent('DropdownMenu');
    const DropdownItem = getComponent('DropdownItem');
    // Todo: render convert to OAS3 only if currently 'isSwagger2`, which we can get from specSelectors.isSwagger2()
    // Todo: implement Modal progress
    return (
      <DropdownMenu displayName="Edit">
        <DropdownItem onClick={() => this.onConvertToYamlClick()} name="Convert To YAML" />
        <DropdownItem onClick={() => this.onConvertToOas3Click()} name="Convert To OpenAPI 3" />
      </DropdownMenu>
    );
  }
}

EditMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
