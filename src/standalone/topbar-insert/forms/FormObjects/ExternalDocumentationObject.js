import { OrderedMap } from "immutable"

export const ExternalDocumentationForm = (updateForm, path) => 
  new OrderedMap({
    url: new OrderedMap({
      value: "",
      isRequired: true, 
      hasErrors: false,
      name: "URL",
      description: "REQUIRED. The URL for the target documentation. Value MUST be in the format of a URL.",
      updateForm: event => updateForm(event, path.concat(["url"])),
      validationMessage: "Please enter a valid URL."
    }),
    description: new OrderedMap({
      value: "",
      isRequired: false,
      name: "Description",
      description: "A short description of the target documentation. CommonMark syntax MAY be used for rich text representation.",
      hasErrors: false,
      updateForm: event => updateForm(event, path.concat(["description"]))
    })
  })

export const ExternalDocumentationObject = (formData) => { 
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
