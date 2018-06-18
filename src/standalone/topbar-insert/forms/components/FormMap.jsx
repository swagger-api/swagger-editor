import React from "react"
import PropTypes from "prop-types"
import FormInput from "./FormInput"
import FormInputWrapper from "./FormInputWrapper"

const FormMap = (props) => {
  return (
    <div>
      <div className="map-form-left float-left">
        <FormInputWrapper name={props.name} description={props.description} isRequired={props.isRequired}>
          <FormInput 
            isValid={props.isValid} 
            placeholderText={props.placeholderText} 
            validationMessage={props.validationMessage}
            inputValue={props.keyValue}
            onChange={props.onChange}
            isRequired={props.isRequired}
          />
        </FormInputWrapper>
      </div>

      <div className="map-form-right float-right">
        {props.childForm}
      </div>
    </div>
  )
}

FormMap.propTypes = {
  name: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  description: PropTypes.string.isRequired,
  validationMessage: PropTypes.string,
  placeholderText: PropTypes.string,
  keyValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  childForm: PropTypes.any.isRequired
}

export default FormMap
