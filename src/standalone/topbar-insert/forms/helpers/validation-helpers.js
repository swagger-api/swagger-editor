import { OrderedMap, List, Map } from "immutable"
import { isURL } from "validator"

export const checkForEmptyValue = (value) => {
  return !value || value === null || value === "" || !/\S/.test(value) || value === [] ||
   (List.isList(value) && value.count() === 0) ||
   (Map.isMap(value) && !value.size) ||
   (OrderedMap.isOrderedMap(value) && !value.size )
}

// Returns [ updatedFormData, hasErrors ]. The updatedFormData
// will include updated 'hasErrors' attributes.
// Should be called before form submission to ensure that the user
// has entered valid values.
export const checkForErrors = (formData) => {
  let errors = false

  // Invalid object was provided.
  if (!OrderedMap.isOrderedMap(formData) && !Map.isMap(formData)) {
    return [formData, true]
  }

  // The form is a single formData item representing a form with a single field.
  if (formData.has("value") || formData.has("keyValue")) {
    const validationMethod = formData.get("isValid")
    const value = formData.has("keyValue") ? "keyValue" : "value"
    const validationResult = (validationMethod ? !validationMethod(value) : false) 

    errors = errors || validationResult
    return [formData.set("hasErrors", (validationMethod ? !validationResult : false)), errors]
  }

  // The form is an OrderedMap of formData items representing a form with multiple fields.
  // Iterate through them to ensure they are all valid.
  const updatedFormData = formData.map((formItem) => {
    const value = formItem.get("value")
    const isRequired = formItem.get("isRequired")

    // The form field represents a mapping (keyValue => value).
    if (formItem.has("keyValue")) {
      // Perform validation on the child/value.
      const childValidation = checkForErrors(value)

      // Perform validation on the key/parent.
      const keyValidation = checkForErrors(formItem
        .set("value", formItem.get("keyValue"))
        .delete("keyValue"))

      errors = errors || childValidation[1] || keyValidation[1]
      return formItem
        .set("hasErrors", errors)
        .set("value", childValidation[0])
        .set("keyValue", keyValidation[0])
    }

    const isEmpty = checkForEmptyValue(value)

    // The form field is required but nothing has been entered.
    if (isRequired && isEmpty) {
      errors = true
      return formItem.set("hasErrors", true)
    }

    // The form field is not required and nothing has been entered.
    if (!isRequired && isEmpty) {
      return formItem.set("hasErrors", false)
    }

    // Something has been entered in the form field that we need to validate.
    if (!isEmpty) {
      const validationMethod = formItem.get("isValid")

      // If the value is an ordered map, recurse to determine
      // whether any child form data is valid.
      if ((OrderedMap.isOrderedMap(value) || Map.isMap(value)) && isRequired) {
        const itemHasErrors = checkForErrors(value)
        errors = errors || itemHasErrors[1]
        const newvalue = formItem.set("value", itemHasErrors[0])
        return newvalue.set("hasErrors", itemHasErrors[1])
      } else if ((OrderedMap.isOrderedMap(value) || Map.isMap(value)) && !isRequired) {
        return formItem.set("hasErrors", false)
      }

      // If the value is a list, recurse on each item to determine
      // whether any child form data is valid.
      if (List.isList(value)) {
        value.map((item) => {
          const itemHasErrors = checkForErrors(item)
          errors = errors || itemHasErrors[1]
          const newitem = item.set("value", itemHasErrors[0])
          return newitem.set("hasErrors", itemHasErrors[1])
        })
      }

      // The form field is a single form field.
      const validationResult = (validationMethod ? !validationMethod(value) : false) 
      errors = errors || validationResult
      return formItem.set("hasErrors", validationResult)
    }

    return formItem
  })

  return [updatedFormData, errors]
}

export const validateUrl = (url) => {
  return isURL(url)
}

export const validateAlphaNum = (string) => {
  return /^[a-z0-9]+$/i.test(string)
}
