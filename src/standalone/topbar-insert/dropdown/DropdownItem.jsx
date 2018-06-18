import React, { Component } from "react"
import PropTypes from "prop-types"

class DropdownItem extends Component {
  render() {
    return (
      <div>
        <li className="dropdown-item"><button onClick={this.props.onClick}> {this.props.name} </button> </li>
        { this.props.endsSection && 
          <div className="dropdown-divider" />
        }
      </div>
    )
  }
} 

DropdownItem.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  endsSection: PropTypes.bool
}

export default DropdownItem
