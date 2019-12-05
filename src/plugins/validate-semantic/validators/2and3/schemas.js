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

export const validate2And3TypesInDefaultValuesMatchesWithEnum = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { type, items } = schemaObj || {}
        const enumeration = schemaObj.enum
        var isValidFormat = true
        enumeration.forEach(element => {
          if (type === "array" && (!Array.isArray(element) || element === null)) {
            isValidFormat = false
          } else if ((type === "number" || type === "string" || type === "boolean") && !(typeof element === type)) {
            isValidFormat = false
          } else if (type === "integer" && !Number.isInteger(element)) {
            isValidFormat = false
          } else if (type === "object" && ((element == null) || !(typeof element === type))) {
            isValidFormat = false
          }
        });
        if (!isValidFormat) {
          acc.push({
            message: "enum value should conform to its schema's `type`",
            path: [...node.path, "enum"],
            level: "warning",
          });
        }
        return acc
      }, [])
    })
}