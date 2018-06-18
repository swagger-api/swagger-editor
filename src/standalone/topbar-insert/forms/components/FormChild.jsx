import React from "react"
import PropTypes from "prop-types"
import FormInputWrapper from "./FormInputWrapper"

const FormChild = (props) => {
  return (
    <div key={props.name} className="card-body">
      <FormInputWrapper name={props.name} description={props.description} isRequired={props.isRequired}>
          { !props.isRequired && <a href="javascript:void(0)" onClick={props.flipRequired}> Add {props.name} </a> }
          { props.isRequired && props.optional && <a href="javascript:void(0)" onClick={props.flipRequired}> Remove {props.name} </a> }
          { props.isRequired && props.childForm } 
      </FormInputWrapper>
    </div>
  )
}

FormChild.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  childForm: PropTypes.any.isRequired,
  flipRequired: PropTypes.func.isRequired,
  optional: PropTypes.bool.isRequired
}

export default FormChild
