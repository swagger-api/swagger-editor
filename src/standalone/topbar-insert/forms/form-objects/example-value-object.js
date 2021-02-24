import { fromJS } from "immutable"
import { selectResponseObject, selectResponseForm } from "./select-response"

export const exampleForm = (updateForm, path, existing) => (
  fromJS({
    selectresponse: {
      name: "Select Response",
      value: selectResponseForm(updateForm, path.concat(["selectresponse", "value"]), existing),
      isRequired: true,
      description: "Select the location in the document where you wish to add an example."
    },
    exampleName: {
      name: "Example Name",
      description: "The name of the sample response.",
      value: "",
      updateForm: event => updateForm(event, path.concat(["exampleName"])),
      isRequired: true,
      dependsOn: ["selectresponse", "value", "mediatype", "value"]
    },
    exampleValue: {
      name: "Example Value",
      value: "",
      bigTextBox: true,
      updateForm: event => updateForm(event, path.concat(["exampleValue"])),
      description: "The value of the sample response. This can be an arbitrary string, json, xml, etc.",
      isRequired: true,
      dependsOn: ["selectresponse", "value", "mediatype", "value"]
    }
  })
)

export const exampleObject = (formData) => {
  const responsePath = selectResponseObject(formData.getIn(["selectresponse", "value"]))
  const exampleName = formData.getIn(["exampleName", "value"])
  const exampleValue = formData.getIn(["exampleValue", "value"])

  return {
    responsePath: [...responsePath, "examples"],
    exampleName,
    exampleValue
  }
}