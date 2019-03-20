import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ImportFileMenuItem extends Component {
  onClick() {
    alert("heya!")
  }
  render() {
    // const {  } = this.props

    return <li>
      <button type="button" onClick={this.onClick}>Import from file</button>
    </li>
  }
}

ImportFileMenuItem.propTypes = {
  onDocumentLoad: PropTypes.func.isRequired,
}