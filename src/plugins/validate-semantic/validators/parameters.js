export const validateParameterBadKeys = () => (system) => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.node.required !== true && node.node.in === "path") {
          acc.push({
            level: "error",
            message: "Path parameters must have 'required: true'. You can always create another path/operation without this parameter to get the same behaviour.",
            path: node.path
          })
        }
        return acc
      }, [])
    })
}

export const validateParametersHasOnlyOneBody = () => (system) => {
  return system.validateSelectors
    .allParameterArrays()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const parameters = node.node || []
        let bodyParamSeen = false

        parameters.forEach((param) => {
          if(param.in === "body" && bodyParamSeen) {
            acc.push({
              level: "error",
              message: "Multiple body parameters are not allowed.",
              path: node.path
            })
          }
          if(param.in === "body") {
            bodyParamSeen = true
          }
        })
        return acc
      }, [])
    })
}
