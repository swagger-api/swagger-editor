export const validate2And3TypeArrayRequiresItems = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { type, items } = schemaObj || {}
        if(type === "array" && typeof items === "undefined") {
          acc.push({
            message: "Schemas with 'type: array', require a sibling 'items: ' field",
            path: node.path,
            level: "error",
          })
        } else if(type === "array" && (typeof items !== "object" || Array.isArray(items))) {
          acc.push({
            message: "`items` must be an object",
            path: [...node.path, "items"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}
