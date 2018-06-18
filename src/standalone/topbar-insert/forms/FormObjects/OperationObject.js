import { OrderedMap } from "immutable"

export const OperationForm = (updateForm, path, existingPaths) => 
  new OrderedMap({ 
    path: new OrderedMap({ 
      value: "", 
      isRequired: true, 
      hasErrors: false,
      name: "Path",          
      description: "REQUIRED. The path to add the operation to.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "Please select a path. The field is required.",
      options: existingPaths || ["Please Select"],
      isValid: () => true
    }),
    operation: new OrderedMap({ 
      value: "", 
      isRequired: true, 
      hasErrors: false,
      name: "Operation",          
      description: "REQUIRED. Select an operation.",
      updateForm: event => updateForm(event, path.concat(["operation"])),
      validationMessage: "Please select an operation. The field is required.",
      options: ["get", "put", "post", "delete", "options", "head", "patch", "trace"]
    }),
    summary: new OrderedMap({
      value: "",
      isRequired: false, 
      hasErrors: false,
      name: "Summary",
      description: "Add a short summary of what the operation does.",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "Please enter a version. The version field is required."
    }),
    description: new OrderedMap({
      value: "",
      isRequired: false,
      name: "Description",
      description: "A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.",
      hasErrors: false,
      updateForm: event => updateForm(event, path.concat(["description"]))
    }),
    operationid: new OrderedMap({
      value: "",
      isRequired: false,
      name: "Operation ID",
      description: "Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.",
      hasErrors: false,
      updateForm: event => updateForm(event, path.concat(["operationid"]))
    })
  })

export const OperationObject = (formData) => {
  const newOp = {
    summary: formData.getIn(["summary", "value"]),
    description: formData.getIn(["description", "value"]),
    operationId: formData.getIn(["operationid", "value"]),
    tags: [
      "example operation tag"
    ],
    responses: {
      default: {
        description: "Default error sample response"
      }
    }
  }

  if (!formData.getIn(["path", "value"])) {
    return
  }

  return newOp
}