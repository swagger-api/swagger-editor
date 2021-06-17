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
        const schemaObj = node.node || {}
        const { type } = schemaObj
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

export const validate2And3SchemasDefaultsMatchAnEnum = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const element = node.node || {}

        if(!element || element.enum === undefined || element.default === undefined) {
          // nothing to do
          return acc
        }

        if(element.enum.indexOf(element.default) === -1) {
          acc.push({
            message: "Default values must be present in `enum`",
            path: [...node.path, "default"]
          })
        }

        return acc
      }, [])
    })
}

export const validate2And3MinAndMax = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node || {}
        const {minimum, maximum, minLength, maxLength, minProperties, maxProperties, minItems, maxItems} = schemaObj
        if(typeof minimum === "number" && typeof maximum === "number" && (minimum > maximum)) {
          acc.push({
            message: "'minimum' must be lower value than 'maximum'",
            path: [...node.path, "minimum"],
            level: "error",
          })
        }

        if(typeof minLength === "number" && typeof maxLength === "number" && (minLength > maxLength)) {
          acc.push({
            message: "'minLength' must be lower value than 'maxLength'",
            path: [...node.path, "minLength"],
            level: "error",
          })
        }

        if(typeof minProperties === "number" && typeof maxProperties === "number" && (minProperties > maxProperties)) {
          acc.push({
            message: "'minProperties' must be lower value than 'maxProperties'",
            path: [...node.path, "minProperties"],
            level: "error",
          })
        }

        if(typeof minItems === "number" && typeof maxItems === "number" && (minItems > maxItems)) {
          acc.push({
            message: "'minItems' must be lower value than 'maxItems'",
            path: [...node.path, "minItems"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}