import { fromJS } from "immutable"

export const externalDocumentationForm = (updateForm, path) => 
  fromJS({
    url: {
      value: "",
      isRequired: true, 
      name: "URL",
      description: "REQUIRED. The URL for the target documentation. Value MUST be in the format of a URL.",
      updateForm: event => updateForm(event, path.concat(["url"])),
      validationMessage: "Please enter a valid URL."
    },
    description: {
      value: "",
      name: "Description",
      description: "A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.",
      updateForm: event => updateForm(event, path.concat(["description"]))
    }
  })

export const externalDocumentationObject = (formData) => { 
  const url = formData.getIn(["url", "value"])
  const description = formData.getIn(["description", "value"])

  if (!url && !description) {
    return null
  }

  const externalDocumentation = {}

  if (url) {
    externalDocumentation.url = url
  }

  if (description) {
    externalDocumentation.description = description
  }

  return externalDocumentation
}
