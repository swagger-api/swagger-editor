import { OrderedMap } from "immutable"
import { ExternalDocumentationObject, ExternalDocumentationForm } from "./ExternalDocumentationObject"

export const TagForm = (updateForm, path) => 
  new OrderedMap({ 
    name: new OrderedMap({
      value: "",
      isRequired: true, 
      hasErrors: false,
      name: "Name",
      description: "REQUIRED. The name of the tag.",
      validationMessage: "Please enter a tag name. The name field is required.",
      updateForm: newForm => updateForm(newForm, path.concat(["name"]))
    }),
    description: new OrderedMap({
      value: "",
      isRequired: false,
      name: "Description",
      description: "A short description of the tag. CommonMark syntax MAY be used for rich text representation.",
      hasErrors: false,
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    }),
    externalDocs: new OrderedMap({
      value: ExternalDocumentationForm(updateForm, path.concat(["externalDocs", "value"])),
      isRequired: false,
      name: "External Documentation",
      hasErrors: false,
      updateForm: newForm => updateForm(newForm, path.concat(["externalDocs"]))
    }) 
  })

export const TagObject = (formData) => {
  const name = formData.getIn(["name", "value"])
  const description = formData.getIn(["description", "value"])
  const externalDocs = formData.getIn(["externalDocs", "value"])

  const externalDocsObject = ExternalDocumentationObject(externalDocs)
  const tagObject = {}

  if (!name && !description && !externalDocsObject) {
    return null
  }

  if (name) {
    tagObject.name = name
  }

  if (description) {
    tagObject.description = description
  }

  if (externalDocsObject) {
    tagObject.externalDocs = externalDocsObject
  }

  return tagObject
}
