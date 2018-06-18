import { OrderedMap } from "immutable"

export const PathForm = (updateForm, path) => 
  new OrderedMap({ 
    path: new OrderedMap({ 
      value: "", 
      isRequired: true, 
      hasErrors: false,
      name: "Path",          
      description: "REQUIRED. The path to add.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "Please enter a path. The field is required."
    }),
    summary: new OrderedMap({ 
      value: "", 
      isRequired: false, 
      hasErrors: false,
      name: "Summary",          
      description: "Enter a summary of the path.",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "Please select an operation. The field is required."
    }),
    description: new OrderedMap({
      value: "",
      isRequired: false, 
      hasErrors: false,
      name: "Description",
      description: "An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.",
      updateForm: event => updateForm(event, path.concat(["description"]))
    })
  })

export const PathObject = (formData) => {
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