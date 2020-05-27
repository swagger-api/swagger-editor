export const validateOAS3RefsForRequestBodiesReferenceRequestBodyPositions = () => sys => {
  return sys.validateSelectors
    .allOAS3RequestBodies()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node
        const ref = value.$ref

        if (!ref) {
          return acc
        }

        const [refPath = ""] = ref.split("#")
        const pathArr = refPath.split("/") || []

        // Ignore external references
        if (ref.startsWith("#/")) {
          // Local cases
          if (refPath.endsWith("requestBody") && (refPath.startsWith("/paths") || refPath.startsWith("/components"))){
            return acc  
          }

          // Starting with #/compontents/schemas is not allowed
          if (ref.startsWith("#/components/schemas")) {
            acc.push({
              level: "error",
              message: `requestBody $refs cannot point to '#/components/schemas/…', they must point to '#/components/requestBodies/…'`,
              path: [...node.path, "$ref"]
            })
          } else
          if (ref.startsWith("#/components") && !ref.startsWith("#/components/requestBodies/")) {
            acc.push({
              level: "error",
              message: `requestBody $refs must point to a position where a requestBody can be legally placed`,
              path: [...node.path, "$ref"]
            })
          }

          // Extensions are valid
          if (ref.startsWith("#/") && pathArr.some(element => element.startsWith("x-"))){
            return acc  
          }
        } 
        return acc
        
      }, [])
    })
}

export const validateOAS3RequestBodyRefsReferenceAllowableSchemaPositions = () => sys => {
  return sys.validateSelectors
    .allOAS3RequestBodySchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node
        const ref = value.$ref

        if(!ref) {
          return acc
        }

        const [, refPath = ""] = ref.split("#")
        const pathArr = refPath.split("/") || []
        const parentRefKey = pathArr.slice(-2)[0]
        const targetRefKey = pathArr.slice(-1)[0]
        if(
          targetRefKey !== "schema"
          && parentRefKey !== "schemas"
          && ref.startsWith("#/")
        ) {
          acc.push({
            level: "error",
            message: `requestBody schema $refs must point to a position where a Schema Object can be legally placed`,
            path: [...node.path, "$ref"]
          })
        }
        return acc
      }, [])
    })
}

export const validateOAS3ParameterRefsReferenceParameterPositions = () => sys => {
  return sys.validateSelectors
    .allParameters()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node
        const ref = value.$ref

        if(!ref) {
          return acc
        }

        if (ref.startsWith("#/components/headers")) {
          acc.push({
            level: "error",
            message: `OAS3 parameter $refs should point to #/components/parameters/... and not #/components/headers/...`,
            path: [...node.path, "$ref"]
          })
        }   
        return acc
      }, [])
    })
}

export const validateOAS3RefsForHeadersReferenceHeadersPositions = () => sys => {
  return sys.validateSelectors
    .allHeaders()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const value = node.node
        const ref = value.$ref

        if(!ref) {
          return acc
        }

        if (ref.startsWith("#/components/parameters")) {
          acc.push({
            level: "error",
            message: `OAS3 header $refs should point to #/components/headers/... and not #/components/parameters/...`,
            path: [...node.path, "$ref"]
          })
        }
        return acc
      }, [])
    })
}