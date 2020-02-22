export const validate2And3SecurityRequirementsHaveDefinitions = () => (system) => {
  const { allSecurityRequirements, allSecurityDefinitions } = system.validateSelectors

  return Promise.all([allSecurityRequirements(), allSecurityDefinitions()])
    .then(([requirementNodes, definitionNodes]) => {
      const definedSecuritySchemes = definitionNodes
        .map(node => node.key)

      return requirementNodes.reduce((acc, node) => {
        const value = node.node
        const requiredSecurityDefinitions = Object.keys(value) || []

        requiredSecurityDefinitions.forEach(name => {
          if(definedSecuritySchemes.indexOf(name) < 0) {
            acc.push({
              message: "Security requirements must match a security definition",
              path: [...node.path],
              level: "error",
            })
          }
        })
        return acc
      }, [])
    })
}

export const validate2And3UnusedSecuritySchemes = () => (system) => {
  const { allSecurityRequirements, allSecurityDefinitions } = system.validateSelectors

  return Promise.all([allSecurityRequirements(), allSecurityDefinitions()])
    .then(([securityRequirements, securitySchemes]) => {
      // Get just the names of security schemes used in `security`
      const usedSecurities = securityRequirements
        .map(node => Object.keys(node.node) || [])
        .reduce(function(a, b) {
          // flatten!
          return a.concat(b)
        }, [])

      return securitySchemes.reduce((acc, node) => {
        if(usedSecurities.indexOf(node.key) < 0) {
          acc.push({
            message: "Security scheme was defined but never used. To apply security, use the `security` section in operations or on the root level of your API definition.",
            path: node.path,
            level: "warning",
          })
        }
        return acc
      }, [])
    })
}
