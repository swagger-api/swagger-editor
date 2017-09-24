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
            path: path
          })
        }

        if (securityDefinition) {
          let scopes = obj[key]
          if (Array.isArray(scopes)){

            // Check for unknown scopes

            scopes.forEach((scope, i) => {
              if (!securityDefinition.scopes || !securityDefinition.scopes[scope]) {
                errors.push({
                  message: `Security scope definition ${scope} could not be resolved`,
                  path: path.concat([i.toString()])
                })
              }
            })
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
