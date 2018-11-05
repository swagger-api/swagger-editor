import { fromJS } from "immutable"
import { externalDocumentationObject, externalDocumentationForm } from "./external-documentation-object"

export const tagForm = (updateForm, path) => 
  fromJS({ 
    name: {
      value: "",
      isRequired: true, 
      name: "Name",
      description: "REQUIRED. The name of the tag.",
      validationMessage: "Please enter a tag name. The name field is required.",
      updateForm: newForm => updateForm(newForm, path.concat(["name"]))
    },
    description: {
      value: "",
      name: "Description",
      description: "A short description of the tag. CommonMark syntax MAY be used for rich text representation.",
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    },
    externalDocs: {
      value: externalDocumentationForm(updateForm, path.concat(["externalDocs", "value"])),
      name: "External Documentation",
      updateForm: newForm => updateForm(newForm, path.concat(["externalDocs"]))
    }
  })

export const tagObject = (formData) => {
  const name = formData.getIn(["name", "value"])
  const description = formData.getIn(["description", "value"])
  const externalDocs = formData.getIn(["externalDocs", "value"])

  const externalDocsObject = externalDocumentationObject(externalDocs)
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
