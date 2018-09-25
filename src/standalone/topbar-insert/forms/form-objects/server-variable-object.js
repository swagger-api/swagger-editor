import { fromJS } from "immutable"

const enumFormItem = (j, updateForm, path) => fromJS({
  name: "Enum Value",
  description: "A value in the enumeration of possible variable values.",
  isRequired: false,
  hasErrors: false,
  value: "",
  updateForm: newForm => updateForm(newForm, path.concat(["value", j]))
})

const serverVariableFormItem = (i, updateForm, path) => fromJS({ 
  isRequired: true,
  name: "Variable Name",
  keyValue: "",
  description: "The name of the server variable.",
  value: {
    default: {
      value: "",
      isRequired: true,
      name: "Default",
      description: "REQUIRED. The default value to use for substitution, and to send, if an alternate value is not supplied. Unlike the Schema Object's default, this value MUST be provided by the consumer.",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "default"]))
    },
    enum: {
      value: [enumFormItem(0, updateForm, path.concat(["value", i, "value", "enum"]))],
      name: "Enum",
      defaultItem: j => enumFormItem(j, updateForm, path.concat(["value", i, "value", "enum"])),
      description: "An enumeration of string values to be used if the substitution options are from a limited set.",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "enum"]))
    },
    vardescription: {
      value: "",
      name: "Description",
      description: "A short description of the tag. CommonMark syntax MAY be used for rich text representation.",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "vardescription"]))
    }
  },
  updateForm: newForm => updateForm(newForm, path.concat(["value", i]))
})

export const serverVariableForm = (updateForm, path) =>
  fromJS({
    value: [],
    name: "Server Variables",
    description: "A map between a variable name and its value. The value is used for substitution in the server's URL template.",
    updateForm: newForm => updateForm(newForm, path),
    defaultItem: i => serverVariableFormItem(i, updateForm, path)
  })

export const serverVariableObject = (formData) => {
  const variables = formData.get("value")
  const newVariables = {}

  variables.forEach((variable) => {      
    const varName = variable.getIn(["keyValue"])      
    const varValue = variable.getIn(["value"])

    const enumVal = varValue.getIn(["enum", "value"])
    const enumValues = []

    if (enumVal) {
      enumVal.forEach((option) => {
        enumValues.push(option.get("value"))
      })
    }

    const newVariable = {
      default: varValue.getIn(["default", "value"]),
      enum: enumValues,
      description: varValue.getIn(["vardescription", "value"])
    }

    newVariables[varName] = newVariable
  })

  return newVariables
}
