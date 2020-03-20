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

        const [, refPath = ""] = ref.split("#")
        const pathArr = refPath.split("/") || []
        const parentRefKey = pathArr.slice(-2)[0]
        const targetRefKey = pathArr.slice(-1)[0]

        // External references starting with http:// or https://
        if (ref.startsWith("https://") || ref.startsWith("http://")){
          return acc  
        }

        // External references starting with ./
        if (ref.startsWith("./")){
          return acc  
        }

        // Extensions are valid
        if (ref.startsWith("#/") && (parentRefKey.startsWith("/x-") || targetRefKey.startsWith("/x-"))){
          return acc  
        }

        // Edge cases
        if (ref.endsWith("requestBody") && (ref.startsWith("#/paths") || ref.startsWith("#/components"))){
          return acc  
        }

        // External references ending with yaml
        if (ref.endsWith(".yaml")) {
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

        return acc
        
      }, [])
    })
}
