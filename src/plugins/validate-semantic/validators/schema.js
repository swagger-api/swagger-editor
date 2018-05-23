export const validateMinAndMax = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const {minimum, maximum, minLength, maxLength, minProperties, maxProperties} = schemaObj
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
        return acc
      }, [])
    })
}

export const validateTypeKeyShouldBeString = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node

        if(schemaObj.type !== undefined && typeof schemaObj.type !== "string") {
          acc.push({
            message: `Schema "type" key must be a string`,
            path: [...node.path, "type"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

export const validateReadOnlyPropertiesNotRequired = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        if(Array.isArray(schemaObj.required) && typeof schemaObj.properties === "object") {
          schemaObj.required.forEach((prop, i) => {
            if(schemaObj.properties[prop] && schemaObj.properties[prop].readOnly) {
              acc.push({
                message: `Read only properties cannot be marked as required by a schema.`,
                path: [...node.path, "required", i.toString()],
                level: "error",
              })
            }
          })
        }
        return acc
      }, [])
    })
}

// See https://github.com/swagger-api/swagger-editor/issues/1601
export const validateSchemaPatternHasNoZAnchors = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { pattern } = schemaObj || {}
        if(typeof pattern === "string" && pattern.indexOf("\\Z") > -1) {
          acc.push({
            message: `"\\Z" anchors are not allowed in regular expression patterns`,
            path: [...node.path, "pattern"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}
