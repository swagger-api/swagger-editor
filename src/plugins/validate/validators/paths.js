const operationKeys = ["get", "post", "put", "delete", "options", "head", "patch"]

const PATH_TEMPLATES_REGEX = /\{(.*?)\}/g

export const validatePathParameterDeclarationHasMatchingDefiniton = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const pathItem = node.node

        const pathTemplates = (node.key.match(PATH_TEMPLATES_REGEX) || [])
          .map(str => str.replace("{", "").replace("}", ""))
        if(pathTemplates.length) {
          pathTemplates.forEach(paramName => {
            if(paramName.length === 0) {
              // don't validate empty param names... they're invalid anyway
              return
            }
            if(!checkForDefinition(paramName, pathItem)) {
              acc.push({
                message: `Declared path parameter "${paramName}" needs to be defined as a path parameter at either the path or operation level`,
                path: [...node.path],
                level: "error",
              })
            }
          })
        }
        return acc
      }, [])
    })
}

export const validatePathParameterDeclarationIsNotEmpty = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const pathTemplates = (node.key.match(PATH_TEMPLATES_REGEX) || [])
          .map(str => str.replace("{", "").replace("}", ""))

        const emptyPathTemplates = pathTemplates.filter(v => !v.length)

        if(emptyPathTemplates.length) {
          acc.push({
            message: `Empty path parameter declarations are not valid`,
            path: [...node.path],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

export const validatePathParameterKeysAreDifferent = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      const seen = []
      return nodes.reduce((acc, node) => {
        const realPath = node.key.replace(PATH_TEMPLATES_REGEX, "~~")
        if(seen.indexOf(realPath) > -1) {
          acc.push({
            message: `Equivalent paths are not allowed.`,
            path: [...node.path],
            level: "error",
          })
        }
        seen.push(realPath)
        return acc
      }, [])
    })
}

export const validatePathParameterKeysDontContainQuestionMarks = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.key.indexOf("?") > -1) {
          acc.push({
            message: `Query strings in paths are not allowed.`,
            path: [...node.path],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}


/// Helpers

function checkForDefinition(paramName, pathItem) {
  const pathItemParameters = pathItem.parameters
  const operationsInPathItem = (Object.keys(pathItem) || [])
    .filter(key => operationKeys.indexOf(key) > -1)
    .map(key => pathItem[key])

  let definitionFound = false

  // Look at the path parameters
  if(Array.isArray(pathItemParameters)) {
    pathItemParameters.forEach(param => {
      if(param.name === paramName && param.in === "path") {
        definitionFound = true
      }
    })
  }

  // Next, look at the operation...
  // Mark as found if _every_ operation has a definition for the path param
  if(!definitionFound && operationsInPathItem.length) {
    definitionFound = operationsInPathItem
      .every(op => {
        if(!Array.isArray(op.parameters)) {
          return false
        }
        return op.parameters
          .some(param => param.name === paramName && param.in === "path")
      })
  }

  return definitionFound
}
