import React from "react"
import PropTypes from "prop-types"
import { OrderedMap, Map, List } from "immutable"
import { flipRequired, onChange, addFormItem } from "../helpers/form-data-helpers"

const InsertFormInput = ({ getComponent, index, formData }) => {
  const FormMap = getComponent("FormMap")
  const FormChild = getComponent("FormChild")
  const FormInputWrapper = getComponent("FormInputWrapper")
  const FormDropdown = getComponent("FormDropdown")
  const InsertForm = getComponent("InsertForm")
  const InsertFormList = getComponent("InsertFormList")
  const FormInput = getComponent("FormInput")

  let input
  const value = formData.get("value")

  // The form represents a (key, value) pair.
  if (formData.has("keyValue")) {
    return (
      <FormMap 
        key={formData.get("name")}
        name={formData.get("name")}
        description={formData.get("description")}
        isRequired={formData.get("isRequired")}
        isValid={!formData.get("hasErrors")} 
        placeholderText={formData.get("placeholder")} 
        validationMessage={formData.get("validationMessage")}
        keyValue={formData.get("keyValue") || ""}
        onChange={event => onChange(event, formData)}
        childForm={<InsertForm formData={value} getComponent={getComponent} />}
        getComponent={getComponent}
      />
    )
  } else if (OrderedMap.isOrderedMap(value) || Map.isMap(value)) { 
    // The form has a child form.
    return (
      <FormChild 
        key={formData.get("name")}
        name={formData.get("name")}
        flipRequired={() => flipRequired(formData)}
        description={formData.get("description")}
        isRequired={formData.get("isRequired")}
        optional={formData.get("optional")}
        childForm={<InsertForm formData={value} getComponent={getComponent}/>}
        getComponent={getComponent}
      />
    )
  } else if (formData.has("options")) { 
    // The input is a dropdown-type input.
    input = (
      <FormDropdown 
        key={formData.get("name")}
        isValid={!formData.get("hasErrors")}
        placeholderText={formData.get("placeholder")} 
        validationMessage={formData.get("validationMessage")}
        selected={value || formData.get("placeholder") || "Please Select"}
        onChange={event => onChange(event, formData)}
        isRequired={formData.get("isRequired")}
        options={formData.get("options")}
        isValidAddition={formData.get("isValid")}
      />)
  } else if (List.isList(value)) {
    // The element is a list-control.
    const childForm = <InsertFormList formData={value} parent={formData} getComponent={getComponent}/>

    input = (
      <div key={formData.get("name")}>
        {childForm}
        <a role="button" className="d-inline-block float-right" onClick={() => addFormItem(formData)}>Add {formData.get("name")}</a>
      </div>
    )
  } else { // The element is a basic input.
    input = (
      <FormInput 
        key={formData.get("name")}
        isValid={!formData.get("hasErrors")} 
        placeholderText={formData.get("placeholder")} 
        validationMessage={formData.get("validationMessage")}
        inputValue={value || ""}
        onChange={event => onChange(event, formData)}
        isRequired={formData.get("isRequired")}
        bigTextBox={formData.get("bigTextBox")}
      />)
  }
  
  return (
    <FormInputWrapper 
      key={`${formData.get("name")}-${index}` } 
      name={formData.get("name")} 
      description={formData.get("description")} 
      isRequired={formData.get("isRequired")}
    >
      { input }
    </FormInputWrapper>
  )
}

InsertFormInput.propTypes = {
  formData: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default InsertFormInput