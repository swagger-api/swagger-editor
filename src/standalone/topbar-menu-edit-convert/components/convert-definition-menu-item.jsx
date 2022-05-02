import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ConvertDefinitionMenuItem extends Component {
  render() {
    const { hasNullSwagger2ConverterUrl, isSwagger2, } = this.props

    if(hasNullSwagger2ConverterUrl || !isSwagger2) {
      return null
    }

    return <li>
      <button type="button" onClick={this.props.onClick}>Convert to OpenAPI 3</button>
    </li>
  }
}

ConvertDefinitionMenuItem.propTypes = {
  hasNullSwagger2ConverterUrl: PropTypes.bool.isRequired,
  isSwagger2: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
