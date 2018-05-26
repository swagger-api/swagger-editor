import flatten from "lodash/flatten"

export const isVendorExt = (state,node) => node.path.some(a => a.indexOf("x-") === 0)
export const isDefinition = (state,node) => node.path[0] == "definitions" && node.path.length == 2
export const isRootParameter = (state, node) => node.path[0] === "parameters" && node.path.length === 2
export const isPathItemParameter = (state, node) => node.path[2] === "parameters" && node.path.length === 4
export const isRootParameters = (state, node) => node.path[0] === "parameters" && node.path.length === 1
export const isPathItemParameters = (state, node) => node.path[2] === "parameters" && node.path.length === 3
export const isOperationParameters = (state, node) => node.path[3] === "parameters" && node.path.length === 4
export const isRootResponse = (state, node) => node.path[0] === "responses" && node.path.length === 2
export const isRootHeader = (state, node) => node.path[0] === "headers" && node.path.length === 2
export const isRef = (state, node) => node.key === "$ref" && typeof node.node === "string" // This selector can be fooled.
export const isRefArtifact = (state, node) => node.key === "$$ref" && typeof node.node === "string"
export const isOAS3RootRequestBody = (state, node) => node.path.length === 3 && node.path[1] === "requestBodies"
export const isOAS3OperationRequestBody = (state, node) => node.path.length === 4 && node.path[3] === "requestBody"
export const isOAS3OperationCallbackRequestBody = (state, node) => node.path.length === 8 && node.path[7] === "requestBody"

export const isSubSchema = (state, node) => (sys) => {
  const path = node.path
  if(path.length < 3) {
    return false
  }
  if(node.parent.key == "properties") {
    if(node.parent.parent && node.parent.parent.node && node.parent.parent.node.type === "object") {
      return !sys.validateSelectors.isVendorExt(node)
    }
  } else if(node.key === "additionalProperties") {
    if(node.parent && node.parent.node && node.parent.node.type === "object") {
      return !sys.validateSelectors.isVendorExt(node)
    }
  } else if(node.key == "items") {
    if(node.parent.node && node.parent.node.type === "array") {
      return !sys.validateSelectors.isVendorExt(node)
    }
  }
}

export const isParameter = (state, node) => (sys) => {
  if(sys.validateSelectors.isVendorExt(node)) {
    return false
  }
  return (
    sys.validateSelectors.isRootParameter(node)
      || sys.validateSelectors.isPathItemParameter(node)
      || ( node.path[0] === "paths"
           && node.path[3] === "parameters"
           && node.path.length === 5)
  )
}

export const isOAS3RequestBody = (state, node) => (sys) => {
  if(sys.validateSelectors.isVendorExt(node)) {
    return false
  }
  return (
    sys.validateSelectors.isOAS3RootRequestBody(node)
      || sys.validateSelectors.isOAS3OperationRequestBody(node)
      || sys.validateSelectors.isOAS3OperationCallbackRequestBody(node)
  )
}

export const isParameterSchema = (state, node) => (sys) => {
  if(sys.specSelectors.isOAS3 && sys.specSelectors.isOAS3()) {
    // OAS3
    return node.key === "schema" && sys.validateSelectors.isParameter(node.parent)
  }
  // parameter.x.in != body
  if(sys.validateSelectors.isParameter(node) && node.node.in !== "body") {
    return true
  }
  // parameter.x.in == body
  if(node.key === "schema" && node.parent && sys.validateSelectors.isParameter(node.parent) && node.parent.node.in === "body") {
    return true
  }
}

export const isOAS3RequestBodySchema = (state, node) => () => {
  const [key,, gpKey, ggpKey] = node.path.slice().reverse()

  return key === "schema"
    && gpKey === "content"
    && ggpKey === "requestBody"
}

export const isOAS3ResponseSchema = (state, node) => () => {
  const [key,, gpKey,, gggpKey] = node.path.slice().reverse()

  return key === "schema"
    && gpKey === "content"
    && gggpKey === "responses"
}

export const isResponse = (state, node) => (sys) => {
  if(sys.validateSelectors.isVendorExt(node)) {
    return false
  }
  return (
    sys.validateSelectors.isRootResponse(node)
      || ( node.path[0] === "paths"
           && node.path[3] === "responses"
           && node.path.length === 5)
  )
}

export const isHeader = (state, node) => (sys) => {
  if(sys.validateSelectors.isVendorExt(node)) {
    return false
  }
  return (
    sys.validateSelectors.isRootHeader(node)
      || ( node.path[0] === "paths"
           && node.path[3] === "responses"
           && node.path[5] === "headers"
           && node.path.length === 7)
  )
}

export const isResponseSchema = (state, node) => (sys) => {
  // paths.<operation>.<method>.responses.XXX.schema
  // respones.<response>.schema
  if(node.key === "schema" && node.parent && sys.validateSelectors.isResponse(node.parent)) {
    return true
  }
}

export const allSchemas = () => (system) => {
  const { validateSelectors } = system

  const selectors = [
    validateSelectors.allParameterSchemas(),
    validateSelectors.allResponseSchemas(),
    validateSelectors.allDefinitions(),
    validateSelectors.allHeaders(),
    validateSelectors.allSubSchemas(),
    validateSelectors.allOAS3OperationSchemas()
  ]

  return Promise.all(selectors)
    .then((schemasAr) => {
      return flatten(schemasAr)
    })
}

export const allParameters = () => (system) => {
  return system.fn.traverseOnce({
    name: "allParameters",
    fn: (node) => {
      if(system.validateSelectors.isParameter(node)) {
        return node
      }
    },
  })
}

export const allOAS3RequestBodies = () => (system) => {
  return system.fn.traverseOnce({
    name: "allOAS3RequestBodies",
    fn: (node) => {
      if(system.validateSelectors.isOAS3RequestBody(node)) {
        return node
      }
    },
  })
}

export const allParameterArrays = () => (system) => {
  return system.validateSelectors.allParameters()
    .then(parameters => {
      return parameters.map(node => node.parent)
      .filter((node, i, arr) => {
        return Array.isArray(node.node) && arr.indexOf(node) === i
      })
    })
}

export const allSubSchemas = () => (system) => {
  return system.fn.traverseOnce({
    name: "allSubSchemas",
    fn: (node) => {
      if(system.validateSelectors.isSubSchema(node)) {
        return node
      }
    },
  })
}

export const all$refs = () => (system) => {
  return system.fn.traverseOnce({
    name: "all$refs",
    fn: (node) => {
      if(system.validateSelectors.isRef(node)) {
        return node
      }
    },
  })
}

export const all$refArtifacts = () => (system) => {
  return system.fn.traverseOnce({
    name: "all$refArtifacts",
    fn: (node) => {
      if(system.validateSelectors.isRefArtifact(node)) {
        return node
      }
    },
  })
}

export const allDefinitions = () => (system) => {
  return system.fn.traverseOnce({
    name: "allDefinitions",
    fn: (node) => {
      if(system.validateSelectors.isDefinition(node)) {
        return node
      }
    },
  })
}

export const allParameterSchemas = () => (system) => {
  return system.fn.traverseOnce({
    name: "allParameterSchemas",
    fn: (node) => {
      if(system.validateSelectors.isParameterSchema(node)) {
        return node
      }
    },
  })
}

export const allOAS3OperationSchemas = () => (system) => {
  return system.fn.traverseOnce({
    name: "allOAS3OperationSchemas",
    fn: (node) => {
      if(
        system.validateSelectors.isOAS3RequestBodySchema(node)
         || system.validateSelectors.isOAS3ResponseSchema(node)
       ) {
        return node
      }
    },
  })
}

export const allHeaders = () => (system) => {
  return system.fn.traverseOnce({
    name: "allHeader",
    fn: (node) => {
      if(system.validateSelectors.isHeader(node)) {
        return node
      }
    },
  })
}

export const allResponseSchemas = () => (system) => {
  return system.fn.traverseOnce({
    name: "allResponseSchemas",
    fn: (node) => {
      if(system.validateSelectors.isResponseSchema(node)) {
        return node
      }
    },
  })
}

export const allOperations = () => (system) => {
  return system.fn.traverseOnce({
    name: "allOperations",
    fn: (node) => {
      const isOperation = (
        node.path[0] == "paths"
          && node.path.length === 3
          && !system.validateSelectors.isVendorExt(node)
      )

      if(isOperation) {
        return node
      }
    }
  })
}

export const allPathItems = () => (system) => {
  return system.fn.traverseOnce({
    name: "allPathItems",
    fn: (node) => {
      const isPathItem = (
        node.path[0] == "paths"
          && node.path.length === 2
          && !system.validateSelectors.isVendorExt(node)
      )

      if(isPathItem) {
        return node
      }
    }
  })
}

export const allSecurityDefinitions = () => (system) => {
  return system.fn.traverseOnce({
    name: "allSecurityDefinitions",
    fn: (node) => {
      const isSecurityDefinition = (
        node.path[0] == "securityDefinitions"
          && node.path.length === 2
          && !system.validateSelectors.isVendorExt(node)
      )

      if(isSecurityDefinition) {
        return node
      }
    }
  })
}

export const allSecurityRequirements = () => (system) => {
  return system.fn.traverseOnce({
    name: "allSecurityRequirements",
    fn: (node) => {
      const isGlobalSecurityRequirement = (
        node.path[0] == "security"
          && node.path.length === 2
          && !system.validateSelectors.isVendorExt(node)
      )

      const isOperationSecurityRequirement = (
        node.path[0] == "paths"
          && node.path[3] == "security"
          && node.path.length === 5
          && !system.validateSelectors.isVendorExt(node)
      )

      if(isGlobalSecurityRequirement || isOperationSecurityRequirement) {
        return node
      }
    }
  })
}
