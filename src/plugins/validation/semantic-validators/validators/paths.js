// Assertation 1:
// Path parameters definition, either at the path-level or the operation-level, need matching paramater declarations

// Assertation 2:
// Path parameter declarations do not allow empty names (/path/{} is not valid)

// Assertation 3:
// Path parameters declared in the path string need matching parameter definitions (Either at the path-level or the operation)

// Assertation 4:
// Path strings must be (equivalently) different (Example: /pet/{petId} and /pet/{petId2} are equivalently the same and would generate an error)

// Assertation 5:
// Paths must have unique (name + in combination) parameters

// Assertation 6:
// Paths cannot have partial templates. (/path/abc{123} is illegal)

// Assertation 7:
// Paths cannot have literal query strings in them.

import each from "lodash/each"
import findIndex from "lodash/findIndex"
import isObject from "lodash/isObject"

let templateRegex = /\{(.*?)\}/g

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  let seenRealPaths = {}

  let tallyRealPath = (path) => {
    // ~~ is a flag for a removed template string
    let realPath = path.replace(templateRegex, "~~")
    let prev = seenRealPaths[realPath]
    seenRealPaths[realPath] = true
    // returns if it was previously seen
    return !!prev
  }

  each(resolvedSpec.paths, (path, pathName) => {
    if(!path) {
      return
    }

    pathName.split("/").map(substr => {
      // Assertation 6
      if(templateRegex.test(substr) && substr.replace(templateRegex, "").length > 0) {
        errors.push({
          path: `paths.${pathName}`,
          message: "Partial path templating is not allowed."
        })
      }
    })

    if(pathName.indexOf("?") > -1) {
      errors.push({
        path: `paths.${pathName}`,
        message: "Query strings in paths are not allowed."
      })
    }

    let parametersFromPath = path.parameters ? path.parameters.slice() : []

    let availableParameters = parametersFromPath.map((param, i) => {
      if(!isObject(param)) {
        return
      }
      param.$$path = `paths.${pathName}.parameters[${i}]`
      return param
    })

    each(path, (thing, thingName) => {
      if(thing.parameters) {
        availableParameters.push(...thing.parameters.map((param, i) => {
          if(!isObject(param)) {
            return
          }
          param.$$path = `paths.${pathName}.${thingName}.parameters[${i}]`
          return param
        }))
      }
    })

    // Assertation 4
    let hasBeenSeen = tallyRealPath(pathName)
    if(hasBeenSeen) {
      errors.push({
        path: `paths.${pathName}`,
        message: "Equivalent paths are not allowed."
      })
    }

    // Assertation 5
    each(parametersFromPath, (parameterDefinition, i) => {
      let nameAndInComboIndex = findIndex(parametersFromPath, { "name": parameterDefinition.name, "in": parameterDefinition.in })
      // comparing the current index against the first found index is good, because
      // it cuts down on error quantity when only two parameters are involved,
      // i.e. if param1 and param2 conflict, this will only complain about param2.
      // it also will favor complaining about parameters later in the spec, which
      // makes more sense to the user.
      if(i !== nameAndInComboIndex && parameterDefinition.in) {
        errors.push({
          path: `paths.${pathName}.parameters[${i}]`,
          message: "Path parameters must have unique 'name' + 'in' properties"
        })
      }
    })

    let pathTemplates = pathName.match(templateRegex) || []
    pathTemplates = pathTemplates.map(str => str.replace("{", "").replace("}", ""))

    // Assertation 1
    each(availableParameters, (parameterDefinition, i) => {
      if(isObject(parameterDefinition) && parameterDefinition.in === "path" && (pathTemplates.indexOf(parameterDefinition.name) === -1)) {
        errors.push({
          path: parameterDefinition.$$path || `paths.${pathName}.parameters[${i}]`,
          message: `Path parameter ${parameterDefinition.name} was defined but never used`
        })
      }
    })

    if(pathTemplates) {
      pathTemplates.forEach(parameter => {
        // Assertation 2

        if(parameter === "") { // it was originally "{}"
          errors.push({
            path: `paths.${pathName}`,
            message: "Empty path parameter declarations are not valid"
          })
        } else

        // Assertation 3
        if(findIndex(availableParameters, { name: parameter, in: "path" }) === -1 ) {
          if(findIndex(errors, { path: `paths.${pathName}` }) > -1 ) {
            // don't add an error if there's already one for the path (for assertation 6)
            return
          }
          errors.push({
            path: `paths.${pathName}`,
            message: `Declared path parameter "${parameter}" needs to be defined as a path parameter at either the path or operation level`
          })
        }
      })
    } else {
      each(availableParameters, (parameterDefinition, i) => {
        // Assertation 1, for cases when no templating is present on the path
        if(parameterDefinition.in === "path") {
          errors.push({
            path: `paths.${pathName}.parameters[${i}]`,
            message: `Path parameter ${parameterDefinition.name} was defined but never used`
          })
        }
      })
    }


  })

  return { errors, warnings }
}
