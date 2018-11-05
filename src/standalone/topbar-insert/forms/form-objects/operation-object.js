import { fromJS } from "immutable"

const tagItem = (updateForm, path) => 
  fromJS({
    tag: {
      value: "",
      isRequired: true, 
      name: "Tag",
      description: "REQUIRED. The name of the tag.",
      validationMessage: "Please enter a tag name. The field is required.",
      updateForm: newForm => updateForm(newForm, path.concat(["tag"]))
    }
  })

export const operationForm = (updateForm, path, existingPaths) => 
  fromJS({
    path: { 
      value: "", 
      isRequired: true, 
      name: "Path",          
      description: "REQUIRED. The path to add the operation to.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "Please select a path. The field is required.",
      options: existingPaths || ["Please Select"],
      isValid: () => true
    },
    operation: { 
      value: "", 
      isRequired: true,
      name: "Operation",          
      description: "REQUIRED. Select an operation.",
      updateForm: event => updateForm(event, path.concat(["operation"])),
      validationMessage: "Please select an operation. The field is required.",
      options: ["get", "put", "post", "delete", "options", "head", "patch", "trace"]
    },
    summary: {
      value: "",
      name: "Summary",
      description: "Add a short summary of what the operation does.",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "Please enter a version. The version field is required."
    },
    description: {
      value: "",
      name: "Description",
      description: "A verbose explanation of the operation behavior. CommonMark syntax MAY be used for rich text representation.",
      hasErrors: false,
      updateForm: event => updateForm(event, path.concat(["description"]))
    },
    operationid:{
      value: "",
      name: "Operation ID",
      description: "Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.",
      updateForm: event => updateForm(event, path.concat(["operationid"]))
    },
    tags: {
      value: [],
      name: "Tags",
      description: "A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagItem(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const operationObject = (formData) => {
  const parsedTags = []
  const tags = formData.getIn(["tags", "value"])

  tags.forEach((tag) => {
    parsedTags.push(tag.getIn(["tag", "value"]))
  })

  const newOp = {
    summary: formData.getIn(["summary", "value"]),
    description: formData.getIn(["description", "value"]),
    operationId: formData.getIn(["operationid", "value"]),
    responses: {
      default: {
        description: "Default error sample response"
      }
    }
  }

  if (parsedTags.length) {
    newOp.tags = parsedTags
  }

  if (!formData.getIn(["path", "value"])) {
    return
  }

  return newOp
}