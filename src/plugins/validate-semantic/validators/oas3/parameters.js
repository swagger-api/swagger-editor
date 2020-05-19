export const validateOAS3HeaderParameterNames = () => (system) => {
  return system.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.node.in === "header") {
          const name = (node.node.name || "").toLowerCase()
          if(name === "authorization") {
            acc.push({
              level: "warning",
              message: "Header parameters named \"Authorization\" are ignored. Use the `securitySchemes` and `security` sections instead to define authorization.",
              path: [...node.path, "name"]
            })
          } else if(name === "content-type") {
            acc.push({
              level: "warning",
              message: "Header parameters named \"Content-Type\" are ignored. The values for the \"Content-Type\" header are defined by `requestBody.content.<media-type>`.",
              path: [...node.path, "name"]
            })
          } else if(name === "accept") {
            acc.push({
              level: "warning",
              message: "Header parameters named \"Accept\" are ignored. The values for the \"Accept\" header are defined by `responses.<code>.content.<media-type>`.",
              path: [...node.path, "name"]
            })
          }
        }
        return acc
      }, [])
    })
}
