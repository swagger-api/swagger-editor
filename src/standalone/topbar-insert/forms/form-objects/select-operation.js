import { fromJS } from "immutable"

export const selectOperationForm = (updateForm, path, existing) => (
  fromJS({ 
    path: { 
      value: "", 
      isRequired: true, 
      name: "Path",          
      description: "REQUIRED. The path the operation is under.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "Please select a path. The field is required.",
      options: existing ? existing.getPaths() : [],
      isValid: () => true
    },
    operation: { 
      value: "", 
      isRequired: true, 
      name: "Operation",          
      description: "REQUIRED. Select an operation.",
      updateForm: event => updateForm(event, path.concat(["operation"])),
      validationMessage: "Please select an operation. The field is required.",
      options: [],
      dependsOn: ["path", "value"],
      updateOptions: existing ? existing.getOperations : () => []
    }
  }))

export const selectOperationObject = (formData) => {
  const path = ["paths"]
  path.push(formData.getIn(["path", "value"]))
  path.push(formData.getIn(["operation", "value"]))

  return path
}
