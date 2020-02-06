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
        const { type } = schemaObj || {}
        const isNullable = !!schemaObj.nullable
        const enumeration = schemaObj.enum
        if (enumeration !== null && typeof enumeration !== "undefined") {
          var enumIndex = 0
          enumeration.forEach((element, index) => {
            var isValidFormat = true
            if (element === null && isNullable) {
              return
            }
            if (type === "array" && (!Array.isArray(element) || element === null)) {
              isValidFormat = false
              enumIndex = index
            } else if ((type === "number" || type === "string" || type === "boolean") && !(typeof element === type)) {
              isValidFormat = false
              enumIndex = index
            } else if (type === "integer" && !Number.isInteger(element)) {
              isValidFormat = false
              enumIndex = index
            } else if (type === "object" && ((element === null) || !(typeof element === type) || Array.isArray(element))) {
              isValidFormat = false
              enumIndex = index
            }
            if (!isValidFormat) {
              acc.push({
                message: "enum value should conform to its schema's `type`",
                path: [...node.path, "enum", enumIndex],
                level: "warning",
              })
            }

          }) 
        }
        return acc
      }, [])
    })
}
