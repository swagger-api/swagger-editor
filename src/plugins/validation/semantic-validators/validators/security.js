// Assertation 1:
// Items in `security` must match a `securityDefinition`.


export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  let securityDefinitions = resolvedSpec.securityDefinitions

  function walk(obj, path) {
    if(typeof obj !== "object" || obj === null) {
      return
    }

    if(path[path.length - 2] === "security") {

      // Assertation 1
      Object.keys(obj).map(key => {
        let securityDefinition = securityDefinitions && securityDefinitions[key]
        if (!securityDefinition) {
          errors.push({
            message: "security requirements must match a security definition",
            path: path.join(".")
          })
        }

        if (securityDefinition && securityDefinition.type === "oauth2") {
          let scopes = obj[key]
          if (Array.isArray(scopes)){
            let unresolvedScopes = []
            scopes.forEach((scope) => {
              if (!securityDefinition.scopes[scope]) { unresolvedScopes.push(scope) }
            })
            let unresolvedScopesLen = unresolvedScopes.length
            if ( unresolvedScopesLen ) {
              errors.push({
                message: `security scope definition${unresolvedScopesLen > 1 ? "s" : ""} ${unresolvedScopes.join(", ")} could not be resolved`,
              path: path.join(".")
            })
            }
          }
        }
      })
    }

    if(Object.keys(obj).length) {
      return Object.keys(obj).map(k => walk(obj[k], [...path, k]))

    } else {
      return null
    }

  }

  walk(resolvedSpec, [])

  return { errors, warnings }
}
