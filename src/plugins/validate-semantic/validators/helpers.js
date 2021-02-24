const operationKeys = ["get", "post", "put", "delete", "options", "head", "patch", "trace"]

export const PATH_TEMPLATES_REGEX = /\{(.*?)\}/g

export function checkForDefinition(paramName, pathItem) {
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
    caseMatch: false,
    paramCase: "",
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

        const caseMatch = (op.parameters || [])
        .find(param => param.name && !(param.name === paramName) && (param.name.toLowerCase() === paramName.toLowerCase()) && param.in === "path")

        if(inThisOperation) {
          res.found = true
          res.inOperation = true
        }

        if(caseMatch) {
          res.caseMatch = true
          res.paramCase = caseMatch.name
        }

        if(!inThisOperation) {
          res.missingFromOperations.push(op.method)
        }
      })
  }

  return res
}
