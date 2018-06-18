import { OrderedMap } from "immutable"
import { validateUrl } from "./../helpers/validation-helpers"

export const ContactForm = (updateForm, path) =>
  new OrderedMap({
    value:  new OrderedMap({ 
      name: new OrderedMap({ 
        name: "Name",
        value: "", 
        isRequired: false, 
        hasErrors: false,
        updateForm: newForm => updateForm(newForm, path.concat(["value", "name"]))
      }),
      url: new OrderedMap({
        name: "URL",
        value: "", 
        isRequired: false, 
        hasErrors: false, 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "url"])),
        isValid: value => validateUrl(value),
        validationMessage: "Please enter a valid URL."
      }),
      email: new OrderedMap({
        name: "Email",
        value: "", 
        isRequired: false, 
        hasErrors: false,
        updateForm: newForm => updateForm(newForm, path.concat(["value", "email"]))
      })
    }),
    name: "Contact",
    description: "The contact information for the exposed API.",
    isRequired: false, 
    hasErrors: false,
    updateForm: newForm => updateForm(newForm, path)
  }) 

export const ContactObject = (formData) => {
  const name = formData.getIn(["value", "name", "value"])
  const url = formData.getIn(["value", "url", "value"])
  const email = formData.getIn(["value", "email", "value"])
  const contact = {}

  if (!name && !url && !email) {
    return null
  }

  if (email) {
    contact.email = email
  }

  if (name) {
    contact.name = name
  }

  if (url) {
    contact.url = url
  }

  return contact
}
