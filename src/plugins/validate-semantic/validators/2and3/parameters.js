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

export const validate2And3ParameterDefaultsMatchAnEnum = () => (system) => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const parameter = node.node || {}
        const isOAS3 = system.specSelectors.isOAS3()
        let paramEnum, paramDefault, internalLocation


        if(isOAS3) {
          const schema = parameter.schema
          if(!schema || schema.enum === undefined || schema.default === undefined) {
            // nothing to do
            return acc
          }
          paramEnum = schema.enum
          paramDefault = schema.default
          internalLocation = ["schema", "default"]
        } else {
          if(!parameter || parameter.enum === undefined || parameter.default === undefined) {
            // nothing to do
            return acc
          }
          paramEnum = parameter.enum
          paramDefault = parameter.default
          internalLocation = ["default"]
        }

        if(paramEnum.indexOf(paramDefault) === -1) {
          acc.push({
            message: "Default values must be present in `enum`",
            path: [...node.path, ...internalLocation]
          })
        }

        return acc
      }, [])
    })
}
