import { fromJS } from "immutable"
import { licenseForm, licenseObject } from "./license-object"
import { contactForm, contactObject } from "./contact-object"

export const infoForm = (updateForm, path, existingValues) =>
  fromJS({ 
    title: { 
      value: existingValues ? existingValues.get("title") : "", 
      isRequired: true, 
      name: "Title",
      description: "REQUIRED. The title of the application.",
      updateForm: newForm => updateForm(newForm, path.concat(["title"])),
      validationMessage: "Please enter a title. The field is required."
    }, 
    description: {
      value: existingValues ? existingValues.get("description") : "", 
      name: "Description",
      description: "A short description of the application. CommonMark syntax MAY be used for rich text representation.",
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    },
    version: {
      value: existingValues ? existingValues.get("version") : "", 
      isRequired: true, 
      name: "Version",
      description: "REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).",
      updateForm: newForm => updateForm(newForm, path.concat(["version"])),
      validationMessage: "Please enter a version. The version field is required."
    },
    termsofservice: {
      value: existingValues ? existingValues.get("termsofservice") : "", 
      name: "Terms of Service",
      description: "A URL to the Terms of Service for the API. MUST be in the format of a URL.",
      updateForm: newForm => updateForm(newForm, path.concat(["termsofservice"]))
    },
    license: licenseForm(updateForm, path.concat(["license"]), existingValues ? existingValues.get("license") : ""),
    contact: contactForm(updateForm, path.concat(["contact"]))
  })

export const infoObject = (formData) => {
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

  const contact = contactObject(formData.getIn(["contact"]))
  if (contact) {
    newInfo.contact = contact
  }

  const license = licenseObject(formData.getIn(["license"]))
  if (license) {
    newInfo.license = license
  }

  return newInfo  
}