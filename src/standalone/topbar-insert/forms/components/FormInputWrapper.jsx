import React from "react"
import PropTypes from "prop-types"

const FormInputWrapper = props => (
  <div className="form-group" key={props.description}>
    <label className="input-label">
      <span className="input-label-title">
        {props.name} {props.isRequired && <span>*</span>}
      </span>
      <div>
        {props.description}
      </div>
    </label>
    {props.children} 
  </div>
)

FormInputWrapper.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  children: PropTypes.oneOfType([ 
    PropTypes.array, 
    PropTypes.element 
  ])
}

export default FormInputWrapper
