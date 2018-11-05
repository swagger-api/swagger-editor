import { fromJS } from "immutable"
import { selectOperationForm, selectOperationObject } from "./select-operation"

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

export const addOperationTagsForm = (updateForm, path, existing) =>  
  fromJS({ 
    selectoperation: {
      name: "Select an operation to add tags to.",
      value: selectOperationForm(updateForm, path.concat(["selectoperation", "value"]), existing),
      isRequired: true,
      updateForm: newForm => updateForm(newForm, path.concat(["selectoperation"]))
    },
    tags: {
      value: [],
      dependsOn: ["selectoperation", "value", "operation", "value"],
      name: "Tags",
      description: "A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagItem(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const addOperationTagsObject = (formData) => {
  const parsedTags = []
  const tags = formData.getIn(["tags", "value"])

  tags.forEach((tag) => {
    parsedTags.push(tag.getIn(["tag", "value"]))
  })

  const selectedAndTags = {
    selectedOperation: selectOperationObject(formData.getIn(["selectoperation", "value"])),
    tags: parsedTags
  }

  return selectedAndTags
}