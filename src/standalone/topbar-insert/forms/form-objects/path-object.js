import { fromJS } from "immutable"

export const pathForm = (updateForm, path) => 
  fromJS({ 
    path: { 
      value: "", 
      isRequired: true, 
      name: "Path",          
      description: "REQUIRED. The path to add.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "Please enter a path starting with a '/'. The field is required.",
      isValid: (value) => value.startsWith("/")
    },
    summary: { 
      value: "", 
      name: "Summary",          
      description: "Enter a summary of the path.",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "Please select an operation. The field is required."
    },
    description: {
      value: "",
      name: "Description",
      description: "An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.",
      updateForm: event => updateForm(event, path.concat(["description"]))
    }
  })

export const pathObject = (formData) => {
  const pathSummary = formData.getIn(["summary", "value"])
  const pathDescription = formData.getIn(["description", "value"])
  const newPath = { key: formData.getIn(["path", "value"]), value: {} }

  if (pathSummary) {
    newPath["value"]["summary"] = pathSummary
  }

  if (pathDescription) {
    newPath["value"]["description"] = pathDescription
  }

  return newPath
}