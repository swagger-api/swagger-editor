import React from "react"
import PropTypes from "prop-types"

const FormChild = (props) => {
  const { getComponent } = props
  const FormInputWrapper = getComponent("FormInputWrapper")

  return (
    <div key={props.name} className="card-body">
      <FormInputWrapper name={props.name} description={props.description} isRequired={props.isRequired}>
          { !props.isRequired && <a onClick={props.flipRequired}> Add {props.name} </a> }
          { props.isRequired && props.optional && <a onClick={props.flipRequired}> Remove {props.name} </a> }
          { props.isRequired && props.childForm } 
      </FormInputWrapper>
    </div>
  )
}

FormChild.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  isRequired: PropTypes.bool,
  childForm: PropTypes.any.isRequired,
  flipRequired: PropTypes.func.isRequired,
  optional: PropTypes.bool,
  getComponent: PropTypes.func.isRequired
}

export default FormChild
