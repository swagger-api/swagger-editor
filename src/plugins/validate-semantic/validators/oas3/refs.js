export const validateOAS3RefsForRequestBodiesReferenceRequestBodyPositions = () => sys => {
  return sys.validateSelectors
    .allOAS3RequestBodies()
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
          targetRefKey !== "requestBody"
          && parentRefKey !== "requestBody"
          && parentRefKey !== "requestBodies"
        ) {
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