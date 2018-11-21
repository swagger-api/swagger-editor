import { OrderedMap, Map, List } from "immutable"
import { checkForEmptyValue } from "./validation-helpers"

// Updates a form input given an onChange event,
// the location of the form input data in the form data object, and a function
// 'updateForm' that will update the form data.
export const onChange = (event, formData ) => {
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
export const flipRequired = (formData) => {
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
export const addFormItem = (formData) => {
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
export const removeFormItem = (formData) => {
  const list = formData.get("value")
  const updateForm = formData.get("updateForm")

  if (List.isList(list)) {
    updateForm(formData.set("value", list.pop()))
  }
}
