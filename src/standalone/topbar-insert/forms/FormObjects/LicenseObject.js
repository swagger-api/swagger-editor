import { OrderedMap } from "immutable"
import { validateUrl } from "./../helpers/validation-helpers"

export const LicenseForm = (updateForm, path, existingValues) => 
  new OrderedMap({ 
    value: new OrderedMap({ 
      name: new OrderedMap({
        name: "Name",
        value: existingValues.get("name"), 
        isRequired: true, 
        hasErrors: false, 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "name"]))
      }), 
      url: new OrderedMap({
        name: "URL",
        value: existingValues.get("url"), 
        isRequired: false, 
        hasErrors: !validateUrl(existingValues.get("url")),
        updateForm: newForm => updateForm(newForm, path.concat(["value", "url"])),
        isValid: value => validateUrl(value),
        validationMessage: "Please enter a valid URL."
      })
    }), 
    name: "License",
    isRequired: false, 
    hasErrors: false,
    description: "The license information for the exposed API.",
    updateForm: newForm => updateForm(newForm, path)
  })

export const LicenseObject = (formData) => {
  const name = formData.getIn(["value", "name", "value"])
  const url = formData.getIn(["value", "url", "value"])
  const newLicense = {}

  if (!name && !url) {
    return null
  }

  if (name) {
    newLicense.name = name
  }

  if (url) {
    newLicense.url = url
  }

  return newLicense
}