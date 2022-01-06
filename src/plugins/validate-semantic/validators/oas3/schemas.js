export const validateOAS3SchemaPropertiesReadOnlyWriteNotBothTrue = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { properties } = schemaObj
        if (properties) {
          for (const [key, value] of Object.entries(properties)) {
            if (
              value.readOnly 
              && typeof value.readOnly === "boolean"
              && value.writeOnly
              && typeof value.writeOnly === "boolean"
              ) {
              acc.push({
                message: "A property MUST NOT be marked as both 'readOnly' and 'writeOnly' being 'true'",
                path: [...node.path, "properties", key],
                level: "error",
              })
            }
          }
        }
        return acc
      }, [])
    })
}
