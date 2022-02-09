export const COMPONENT_NAME_REGEX = /^[A-Za-z0-9\-._]+$/

export const validateOAS3ComponentNames = () => (system) => {
  return system.validateSelectors
    .allOAS3Components()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(!COMPONENT_NAME_REGEX.test(node.key)) {
          acc.push({
            level: "error",
            message: "Component names can only contain the characters A-Z a-z 0-9 - . _",
            path: node.path
          })
         }
        return acc
      }, [])
    })
}
