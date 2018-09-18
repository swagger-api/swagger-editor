import { fromJS } from "immutable"
import { serverVariableForm, serverVariableObject } from "./serverVariableObject"

const serverFormItem = (i, updateForm, path) => fromJS({ 
  url: {
    value: "",
    isRequired: true, 
    hasErrors: false,
    name: "URL",
    description: "REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}.",
    validationMessage: "Please enter a URL. The field is required.",
    updateForm: newForm => updateForm(newForm, path.concat(["servers", "value", i, "url"]))
  },
  description: {
    value: "",
    isRequired: false,
    name: "Description",
    description: "An optional string describing the host designated by the URL. CommonMark syntax MAY be used for rich text representation.",
    hasErrors: false,
    updateForm: newForm => updateForm(newForm, path.concat(["servers", "value", i, "description"]))
  },
  variables: serverVariableForm(updateForm, path.concat(["servers", "value", i, "variables"]))
})

export const serversForm = (updateForm, path) => 
  fromJS({
    servers: {
      value: [serverFormItem(0, updateForm, path)],
      isRequired: false,
      name: "Server",
      description: "An object representing a Server.",
      hasErrors: false,
      updateForm: newForm => updateForm(newForm, path.concat(["servers"])),
      defaultItem: i => serverFormItem(i, updateForm, path)
    }
  })

export const serversObject = (formData) => {
  const servers = formData.getIn(["servers", "value"])
  const newServers = []

  servers.forEach((server) => {
    const newServer = {}
    const variables = serverVariableObject(server.get("variables"))
    const description = server.getIn(["description", "value"])
    const url = server.getIn(["url", "value"])
    
    if (variables) {
      newServer.variables = variables
    }

    if (description) {
      newServer.description = description
    }

    if (url) {
      newServer.url = url
    }

    newServers.push(newServer)
  })

  return newServers
}