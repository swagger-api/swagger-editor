import { OrderedMap } from "immutable"
import { LicenseForm, LicenseObject } from "./LicenseObject"
import { ContactForm, ContactObject } from "./ContactObject"

export const InfoForm = (updateForm, path, existingValues) => 
  new OrderedMap({ 
    title: new OrderedMap({ 
      value: existingValues.get("title"), 
      isRequired: true, 
      hasErrors: false,
      name: "Title",
      description: "REQUIRED. The title of the application.",
      updateForm: newForm => updateForm(newForm, path.concat(["title"])),
      validationMessage: "Please enter a title. The field is required."
    }), 
    description: new OrderedMap({
      value: existingValues.get("description"), 
      isRequired: false, 
      hasErrors: false,
      name: "Description",
      description: "A short description of the application. CommonMark syntax MAY be used for rich text representation.",
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    }),
    version: new OrderedMap({
      value: existingValues.get("version"), 
      isRequired: true, 
      hasErrors: false,
      name: "Version",
      description: "REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).",
      updateForm: newForm => updateForm(newForm, path.concat(["version"])),
      validationMessage: "Please enter a version. The version field is required."
    }),
    termsofservice: new OrderedMap({
      value: existingValues.get("termsofservice"), 
      isRequired: false, 
      hasErrors: false,
      name: "Terms of Service",
      description: "A URL to the Terms of Service for the API. MUST be in the format of a URL.",
      updateForm: newForm => updateForm(newForm, path.concat(["termsofservice"]))
    }),
    license: LicenseForm(updateForm, path.concat(["license"]), existingValues.get("license")),
    contact: ContactForm(updateForm, path.concat(["contact"]))
  })

export const InfoObject = (formData) => {
  const newInfo = {
    title: formData.getIn(["title", "value"]),
    version: formData.getIn(["version", "value"])
  }

  const description = formData.getIn(["description", "value"])
  const termsOfService = formData.getIn(["termsofservice", "value"])

  if (description) {
    newInfo.description = description
  }

  if (termsOfService) {
    newInfo.termsOfService = termsOfService
  }

  const contact = ContactObject(formData.getIn(["contact"]))
  if (contact) {
    newInfo.contact = contact
  }

  const license = LicenseObject(formData.getIn(["license"]))
  if (license) {
    newInfo.license = license
  }

  return newInfo  
}