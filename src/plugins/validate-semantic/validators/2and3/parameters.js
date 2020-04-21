import {
  validate2And3DefaultsMatchAnEnum
} from "../helpers"

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
        return validate2And3DefaultsMatchAnEnum(system, acc, node)
      }, [])
    })
}
