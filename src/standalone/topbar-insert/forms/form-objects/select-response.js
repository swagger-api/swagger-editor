import { fromJS } from "immutable"
import { selectOperationObject, selectOperationForm } from "./select-operation"


const selectResponse = (updateForm, path, existing) => fromJS({
  response: {
    value: "",
    isRequired: true,
    name: "Response",
    description: "REQUIRED. The response to add the example to.",
    updateForm: event => updateForm(event, path.concat(["response"])),
    validationMessage: "Please select a response to add the example to. The field is required.",
    options: ["Please Select Or Add Response"],
    dependsOn: ["operation", "value"],
    updateOptions: existing ? existing.getResponses: () => [],
    isValid: () => true
  },
  mediatype: {
    value: "",
    isRequired: true,
    name: "Media Type",
    description: "REQUIRED. The media type of the response. For example, text/plain or application/json.",
    options: ["Please Select Or Add Media Type"],
    dependsOn: ["response", "value"],
    updateForm: event => updateForm(event, path.concat(["mediatype"])),
    updateOptions: existing ? existing.getMediaTypes : () => [],
    isValid: () => true,
    validationMessage: "Please select or add a media type for the example. The field is required."
  }
})

export const selectResponseForm = (updateForm, path, existing) =>
  selectOperationForm(updateForm, path, existing)
    .merge(selectResponse(updateForm, path, existing))


export const selectResponseObject= (formData) => {
  const path = selectOperationObject(formData)
  path.push("responses")
  path.push(formData.getIn(["response", "value"]))
  path.push("content")
  path.push(formData.getIn(["mediatype", "value"]))

  return path
}
