import { SOURCE } from "../actions"
import { getRootNode } from "src/plugins/validate-semantic/helpers"


export const validateParameterFormDataCaseTypo = () => system => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node

        if(
          value.in &&
          typeof value.in === "string" &&
          value.in.toLowerCase() === "formdata" &&
          value.in !== "formData"
        ) {
          acc.push({
            message: `Parameter "in: ${value.in}" is invalid, did you mean "in: formData"?`,
            path: [...node.path],
            level: "error",
            source: SOURCE
          })
        }
        return acc
      }, [])
    })
}

export const validateParameterFormDataForFileTypes = () => system => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node

        if(value.type === "file" && value.in !== "formData") {
          acc.push({
            message: `Parameters with "type: file" must have "in: formData"`,
            path: [...node.path],
            level: "error",
            source: SOURCE
          })
        }
        return acc
      }, [])
    })
}

export const validateParameterFormDataConsumesType = () => system => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node

        const globalConsumes = getRootNode(node).node.consumes ||[]

        // step out of parameter item and array
        const containingContext = node.parent.parent.node
        const contextConsumes = containingContext.consumes || []

        const combinedConsumes = [...globalConsumes, ...contextConsumes]
        if(
          value.type === "file" &&
          value.in === "formData" &&
          combinedConsumes.indexOf("multipart/form-data") === -1
        ) {
          acc.push({
            message: `Operations with parameters of "type: file" must include "multipart/form-data" in their "consumes" property`,
            path: [...node.path],
            level: "error",
            source: SOURCE
          })
        } else if(
          value.in === "formData" &&
          combinedConsumes.indexOf("multipart/form-data") === -1 &&
          combinedConsumes.indexOf("application/x-www-form-urlencoded") === -1
        ) {
          acc.push({
            message: `Operations with Parameters of "in: formData" must include "application/x-www-form-urlencoded" or "multipart/form-data" in their "consumes" property`,
            path: [...node.path.slice(0, -2)],
            level: "error",
            source: SOURCE
          })
        }
        return acc
      }, [])
    })
}

export const validateParameterArraysDontContainBodyAndFormData = () => system => {
  return system.validateSelectors
    .allParameterArrays()
    .then(paramArrays => {
      return paramArrays.reduce((acc, node) => {
        const bodyParams = node.node.filter(param => param.in === "body")
        const formDataParams = node.node.filter(param => param.in === "formData")

        if(bodyParams.length && formDataParams.length) {
          acc.push({
            message: `Parameters cannot have both a "in: body" and "in: formData", as "formData" _will_ be the body`,
            path: [...node.path],
            level: "error",
            source: SOURCE
          })
        }
        return acc
      }, [])
    })
}
