export const validate2And3OperationHasUniqueId = () => sys => {
  return sys.validateSelectors
    .allOperations()
    .then(nodes => {
      const seen = []
      return nodes.reduce((acc, node) => {
        const value = node.node

        const id = value.operationId

        if (id) {
          if (seen.indexOf(id) > -1) {
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
