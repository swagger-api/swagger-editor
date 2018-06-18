import { OrderedMap, List } from "immutable"

const EnumFormItem = (j, updateForm, path) => new OrderedMap({
  name: "Enum Value",
  description: "A value in the enumeration of possible variable values.",
  isRequired: false,
  hasErrors: false,
  value: "",
  updateForm: newForm => updateForm(newForm, path.concat(["value", j]))
})

const ServerVariableFormItem = (i, updateForm, path) => new OrderedMap({ 
  isRequired: true,
  name: "Variable Name",
  keyValue: "",
  description: "The name of the server variable.",
  value: new OrderedMap({
    default: new OrderedMap({
      value: "",
      isRequired: true,
      hasErrors: false,
      name: "Default",
      description: "REQUIRED. The default value to use for substitution, and to send, if an alternate value is not supplied. Unlike the Schema Object's default, this value MUST be provided by the consumer.",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "default"]))
    }),
    enum: new OrderedMap({
      value: new List([EnumFormItem(0, updateForm, path.concat(["value", i, "value", "enum"]))]),
      isRequired: false, 
      hasErrors: false,
      name: "Enum",
      defaultItem: j => EnumFormItem(j, updateForm, path.concat(["value", i, "value", "enum"])),
      description: "An enumeration of string values to be used if the substitution options are from a limited set.",
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "enum"]))
    }),
    vardescription: new OrderedMap({
      value: "",
      isRequired: false,
      name: "Description",
      description: "A short description of the tag. CommonMark syntax MAY be used for rich text representation.",
      hasErrors: false,
      updateForm: newForm => updateForm(newForm, path.concat(["value", i, "value", "vardescription"]))
    })
  }),
  updateForm: newForm => updateForm(newForm, path.concat(["value", i]))
})

export const ServerVariableForm = (updateForm, path) =>
  new OrderedMap({
    value: new List([]),
    isRequired: false,
    name: "Server Variables",
    description: "A map between a variable name and its value. The value is used for substitution in the server's URL template.",
    hasErrors: false,
    updateForm: newForm => updateForm(newForm, path),
    defaultItem: i => ServerVariableFormItem(i, updateForm, path)
  })

export const ServerVariableObject = (formData) => {
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
