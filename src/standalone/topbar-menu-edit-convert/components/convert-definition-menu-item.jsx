import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ConvertDefinitionMenuItem extends Component {
  render() {
    const { isSwagger2, } = this.props
    
    if(!isSwagger2) {
      return null
    }

    return <li>
      <button type="button" onClick={this.props.onClick}>Convert to OpenAPI 3</button>
    </li>
  }
}

ConvertDefinitionMenuItem.propTypes = {
  isSwagger2: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}