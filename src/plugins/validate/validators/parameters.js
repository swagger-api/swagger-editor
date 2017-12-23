export const validateParameterBadKeys = () => (system) => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.keys.includes("example")) {
          acc.push({
            level: "error",
            message: "'example' field is not allowed in parameter",
            path: [...node.path, "example"]
          })
        }
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
