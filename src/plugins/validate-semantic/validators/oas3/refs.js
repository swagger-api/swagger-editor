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
