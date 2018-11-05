/* eslint no-use-before-define: 0 */
import { OrderedMap, Map, List } from "immutable"
import React from "react"
import { checkForEmptyValue } from "./validation-helpers"
import FormInputWrapper from "../components/FormInputWrapper"
import FormDropdown from "../components/FormDropdown"
import FormInput from "../components/FormInput"
import FormMap from "../components/FormMap"
import FormChild from "../components/FormChild"

// Updates a form input given an onChange event,
// the location of the form input data in the form data object, and a function
// 'updateForm' that will update the form data.
const onChange = (event, formData ) => {
  let updatedField
  const updateForm = formData.get("updateForm")
  const isRequired = formData.get("isRequired")

  if (!event) {
    return formData
  }

  const field = formData.has("keyValue") ? "keyValue" : "value"
  const fieldValue = formData.get(field)
  const value = event.target.value

  if (List.isList(fieldValue)) {
    updatedField = formData.set(field, fieldValue.push(value))
  } else {
    updatedField = formData.set(field, value)
  }

  const isEmpty = checkForEmptyValue(value)

  if (isRequired && isEmpty) {
    return updateForm(updatedField.set("hasErrors", true))
  }
  if (!isRequired && isEmpty) {
    return updateForm(updatedField.set("hasErrors", false))
  }

  const validationMethod = formData.get("isValid")

  return updateForm(updatedField.set("hasErrors", validationMethod ? !validationMethod(value) : false))
}

// Sets a formData isRequired attribute to !isRequired. Sets
// a flag property "optional" to track the change that occurred if
// the item was not already required. This allows the add/remove functionality for optional
// child forms.
const flipRequired = (formData) => {
  if (OrderedMap.isOrderedMap(formData.get("value")) || Map.isMap(formData.get("value"))) {
    const isRequired = formData.get("isRequired")
    const updateForm = formData.get("updateForm")
    let updated = formData.set("isRequired", !isRequired)

    if (!isRequired) {
      updated = updated.set("optional", true)
    }

    updateForm(updated)
  }
}

// For use with forms that are List Controls.
// Updates the form data object with an additional list item.
const addFormItem = (formData) => {
  const list = formData.get("value")
  const updateForm = formData.get("updateForm")

  if (List.isList(list)) {
    const defaultItem = formData.get("defaultItem")
    const updated = formData.set("value", list.push(defaultItem(list.size)))

    updateForm(updated) 
  }
}

// For use with forms that are List Controls.
// Updates the form data object with the final list item removed.
const removeFormItem = (formData) => {
  const list = formData.get("value")
  const updateForm = formData.get("updateForm")

  if (List.isList(list)) {
    updateForm(formData.set("value", list.pop()))
  }
}

// Generates a form UI based on the given form data.
export const getForm = (formData) => {
  const formRows = []
  let i = 0

  formData.forEach((v) => {
    if (OrderedMap.isOrderedMap(v) || Map.isMap(v)) {
      // The form field has a prerequisite field that has been filled out.
      const dependsOnNonEmpty = v.has("dependsOn") && !checkForEmptyValue(formData.getIn(v.get("dependsOn")))

      if (dependsOnNonEmpty && v.has("updateOptions")) {
        // There is an action to perform when the prerequisite has been filled out.
        const dependsOnValue = formData.getIn(v.get("dependsOn"))
        const updateOptions = v.get("updateOptions")
        const jsx = getFormInput(v.set("options", updateOptions(dependsOnValue)), i)
        formRows.push(jsx)
      } else if (!v.has("dependsOn") || (!v.has("updateOptions") && dependsOnNonEmpty)) {
        // There is no prerequisite or the prerequisite has been filled out and there is no 
        // additional action to take, so simply show the form field.
        const jsx = getFormInput(v, i)
        formRows.push(jsx)
      } 
    }
    i+=1
  })

  return formRows
}

// Generates a form input UI based on the given form data.
const getFormInput = (formData, index) => {
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
        childForm={getForm(value)}
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
        childForm={getForm(value)}
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
    const childForm = getListControl(value, formData)

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

// Returns the list of react elements that makes up a list control.
const getListControl = (formData, parent) => {
  if (!List.isList(formData)) {
    return (<div> An error occurred while loading the form.</div>)
  }

  const jsx = []

  formData.forEach((item, index) => {
    const showClose = index === formData.count() - 1
    const close = (
      <span type="button" className="close remove-item pull-right" aria-label="remove" onClick={() => removeFormItem(parent)}>
        <span aria-hidden="true">&times;</span>
      </span>
    )

    jsx.push((
      <div className="card-body" key={`index-${index}`}>
        {showClose && close}
        {( (OrderedMap.isOrderedMap(item) || Map.isMap(item)) && item.has("value")) ?
          getFormInput(item, index) : 
          getForm(item)
        }
      </div>
    ))   
  })

  return jsx
}

