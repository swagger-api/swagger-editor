export const validateOperationHasUniqueId = () => sys => {
  return sys.validateSelectors
    .allOperations()
    .then(nodes => {
      const seen = []
      return nodes.reduce((acc, node) => {
        const value = node.node

        // Swagger-Client messes with `value.operationId`, but puts the inital
        // value in `__originalOperationId` when it resolves, so we use that.
        const id = value.__originalOperationId

        if(id) {
          if(seen.indexOf(id) > -1) {
            acc.push({
              level: "error",
              message: "Operations must have unique operationIds.",
              path: [...node.path, "operationId"]
            })
          }
          seen.push(id)
        }
        return acc
      }, [])
    })
}
