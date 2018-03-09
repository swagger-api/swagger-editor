export const validateOAS3GetAndDeleteOpsHaveNoRequestBody = () => sys => {
  return sys.validateSelectors
    .allOperations()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const key = (node.key || "").toLowerCase()
        const value = node.node

        if((key === "get" || key === "delete") && value.requestBody !== undefined) {
          acc.push({
            level: "error",
            message: `${key.toUpperCase()} operations cannot have a requestBody.`,
            path: [...node.path, "requestBody"]
          })
        }
        return acc
      }, [])
    })
}
