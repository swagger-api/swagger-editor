export const validate2And3ParametersHaveUniqueNameAndInCombinations = () => (system) => {
  return system.validateSelectors
    .allParameterArrays()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const parameters = node.node || []

        const seen = []

        parameters.forEach((param, i) => {
          const { name: paramName, in: paramIn } = param

          if(!paramName || !paramIn) {
            // name or in is missing, so we can't match the param to anything else
            return
          }
          const key = `${paramName}::${paramIn}`
          if(seen.indexOf(key) > -1) {
            acc.push({
              level: "error",
              message: "Sibling parameters must have unique name + in values",
              path: [
                ...node.path,
                (param.__i || i).toString()
              ]
            })
          }
          seen.push(key)
        })

        return acc
      }, [])
    })
}

export const validate2And3PathParameterIsDefinedInPath = () => (system) => {
  const refArray = []
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const parameter = node.node || {}
        const path = node.path
        const isFromPath = path[0] === "paths" ? true : false
        const pathString = path[1]
        const paramName = parameter.name
        const paramInPath = `{${paramName}}`
        const ref = parameter.$ref
        const pathStringIncludesParamInPath = pathString && !pathString.toUpperCase().includes("" + paramInPath.toUpperCase())
        if (parameter.in === "path") {
          if (isFromPath && pathStringIncludesParamInPath) {
            acc.push({
              message: `Path parameter "${paramName}" must have the corresponding ${paramInPath} segment in the "${pathString}" path`,
              path: [...node.path, "name"],
              level: "error"
            })
          } else {
            const paramReference = refArray.find(({ referenceParamName }) => referenceParamName === node.key) 
            if (paramReference && paramReference.pathString && !paramReference.pathString.toUpperCase().includes("" + paramInPath.toUpperCase())) {
              acc.push({
                message: `Path parameter "${paramName}" must have the corresponding ${paramInPath} segment in the "${paramReference.pathString}" path`,
                path: [...paramReference.node.path, "name"],
                level: "error"
              })
            }
          }
        } else if (ref !== undefined) {
          const refStrings = ref.split("/")
          refArray.push({referenceParamName:refStrings[refStrings.length-1], pathString:pathString, node: node})
        }
        
        return acc
      }, [])
    })
}