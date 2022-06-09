import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ConvertDefinitionMenuItem extends Component {
  render() {
    const { swagger2ConverterUrl, isSwagger2 } = this.props

    if(swagger2ConverterUrl == null || !isSwagger2) {
      return null
    }

    return <li>
      <button type="button" onClick={this.props.onClick}>Convert to OpenAPI 3</button>
    </li>
  }
}

ConvertDefinitionMenuItem.propTypes = {
  swagger2ConverterUrl: PropTypes.string,
  isSwagger2: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

ConvertDefinitionMenuItem.propTypes = {
  swagger2ConverterUrl: null,
}
