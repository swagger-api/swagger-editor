export const validateOperationHasUniqueId = () => sys => {
  return sys.validateSelectors
    .allOperations()
    .then(nodes => {
      const seen = []
      return nodes.reduce((acc, node) => {
        const value = node.node

        if(value.operationId) {
          if(seen.indexOf(value.operationId) > -1) {
            acc.push({
              level: "error",
              message: "Operations must have unique operationIds.",
              path: [...node.path]
            })
          }
          seen.push(value.operationId)
        }
        return acc
      }, [])
    })
}
