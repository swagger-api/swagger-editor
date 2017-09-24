import each from "lodash/each"

export function validate({ resolvedSpec }) {
  let errors = []
  let warnings = []

  let schemas = []

  if(resolvedSpec.definitions) {
    each(resolvedSpec.definitions, (def, name) => {
      def.name = name
      schemas.push({ schema: def, path: ["definitions", name] })
    })
  }

  if(resolvedSpec.paths) {
    each(resolvedSpec.paths, (path, pathName) => {
      each(path, (op, opName) => {
        if(op && op.parameters) {
          op.parameters.forEach((parameter, parameterIndex) => {
            if(parameter.in === "body" && parameter.schema) {
              schemas.push({
                schema: parameter.schema,
                path: ["paths", pathName, opName, "parameters", parameterIndex.toString(), "schema"]
              })
            }
          })
        }
        if(op && op.responses) {
          each(op.responses, (response, responseName) => {
            if(response && response.schema) {
              schemas.push({
                schema: response.schema,
                path: ["paths", pathName, opName, "responses", responseName, "schema"]
              })
            }
          })
        }
      })
    })
  }

  schemas.forEach(({ schema, path }) => {
    if(Array.isArray(schema.properties) && Array.isArray(schema.required)) {
      schema.properties.forEach(() => {
        errors.push(...generateReadOnlyErrors(schema, path))
      })
    }
  })

  return { errors, warnings }
}

function generateReadOnlyErrors(schema, contextPath) {
  let arr = []

  schema.properties.forEach((property, i) => {
    if(property.name && property.readOnly && schema.required.indexOf(property.name) > -1) {
      arr.push({
        path: contextPath.concat(["required", i.toString()]),
        message: "Read only properties cannot marked as required by a schema."
      })
    }
  })
  return arr
}
