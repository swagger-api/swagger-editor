const operationKeys = ["get", "post", "put", "delete", "options", "head", "patch"]

const PATH_TEMPLATES_REGEX = /\{(.*?)\}/g

export const validatePathParameterDeclarationHasMatchingDefiniton = () => async system => {
  const nodes = await system.validateSelectors.allPathItems()

  return nodes.reduce(async (prev, node) => {
    const acc = await prev
    const pathTemplates = (node.key.match(PATH_TEMPLATES_REGEX) || [])
      .map(str => str.replace("{", "").replace("}", ""))
    if(pathTemplates.length) {
      for (let paramName of pathTemplates) {
        if(paramName.length === 0) {
          // don't validate empty param names... they're invalid anyway
          continue
        }
        const resolverResult = await system.fn.memoizedResolveSubtree(system.specSelectors.specJson(), node.path)
        const res = checkForDefinition(paramName, resolverResult.spec)
        if(res.inOperation && res.missingFromOperations.length) {
          const missingStr = res.missingFromOperations
            .map(str => `"${str}"`)
            .join(", ")

          acc.push({
            message: `Declared path parameter "${paramName}" needs to be defined within every operation in the path (missing in ${missingStr}), or moved to the path-level parameters object`,
            path: [...node.path],
            level: "error",
          })
        } else if(!res.found) {
          acc.push({
            message: `Declared path parameter "${paramName}" needs to be defined as a path parameter at either the path or operation level`,
            path: [...node.path],
            level: "error",
          })
        }
      }
    }
    return acc
  }, Promise.resolve([]))
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
    .map(key => {
      const obj = pathItem[key]
      obj.method = key
      return obj
    })

  const res = {
    found: false,
    inPath: false,
    inOperation: false,
    missingFromOperations: []
  }

  // Look at the path parameters
  if(Array.isArray(pathItemParameters)) {
    pathItemParameters.forEach(param => {
      if(param.name === paramName && param.in === "path") {
        res.found = true
        res.inPath = true
      }
    })
  }

  // Next, look at the operations...
  if(!res.found && operationsInPathItem.length) {
    operationsInPathItem
      .forEach(op => {
        const inThisOperation = (op.parameters || [])
          .some(param => param.name === paramName && param.in === "path")

        if(inThisOperation) {
          res.found = true
          res.inOperation = true
        }

        if(!inThisOperation) {
          res.missingFromOperations.push(op.method)
        }
      })
  }

  return res
}
