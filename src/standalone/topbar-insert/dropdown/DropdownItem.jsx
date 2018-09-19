import React from "react"
import PropTypes from "prop-types"

const DropdownItem = (props) => (
  <div>
    <li className="dropdown-item">
      <button onClick={props.onClick}> {props.name} </button> 
    </li>
    {props.endsSection && <div className="dropdown-divider" />}
  </div>
)

DropdownItem.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string,
  endsSection: PropTypes.bool
}

export default DropdownItem
