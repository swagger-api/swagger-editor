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
