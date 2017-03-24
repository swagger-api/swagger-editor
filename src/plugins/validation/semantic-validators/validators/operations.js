// Assertation 1: Operations cannot have both a 'body' parameter and a 'formData' parameter.
// Assertation 2: Operations must have only one body parameter.
// Assertation 3: Operations must have unique (name + in combination) parameters.

import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import findIndex from "lodash/findIndex"
import findLastIndex from "lodash/findLastIndex"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  map(resolvedSpec.paths,
    (path, pathKey) => {
      let pathOps = pick(path, ["get", "head", "post", "put", "patch", "delete", "options"])
      each(pathOps, (op, opKey) => {

        // Assertation 1
        let bodyParamIndex = findIndex(op.parameters, ["in", "body"])
        let formDataParamIndex = findIndex(op.parameters, ["in", "formData"])
        if(bodyParamIndex > -1 && formDataParamIndex > -1) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.parameters`,
            message: "Operations cannot have both a \"body\" parameter and \"formData\" parameter"
          })
        }
        // Assertation 2
        let lastBodyParamIndex = findLastIndex(op.parameters, ["in", "body"])
        if(bodyParamIndex !== lastBodyParamIndex) {
          errors.push({
            path: `paths.${pathKey}.${opKey}.parameters`,
            message: "Operations must have no more than one body parameter"
          })
        }

        // Assertation 3
        each(op.parameters, (param, paramIndex) => {
          let nameAndInComboIndex = findIndex(op.parameters, { "name": param.name, "in": param.in })
          // comparing the current index against the first found index is good, because
          // it cuts down on error quantity when only two parameters are involved,
          // i.e. if param1 and param2 conflict, this will only complain about param2.
          // it also will favor complaining about parameters later in the spec, which
          // makes more sense to the user.
          if(paramIndex !== nameAndInComboIndex) {
            errors.push({
              path: `paths.${pathKey}.${opKey}.parameters[${paramIndex}]`,
              message: "Operation parameters must have unique 'name' + 'in' properties"
            })
          }
        })
      })
    })

  return { errors, warnings }
}
