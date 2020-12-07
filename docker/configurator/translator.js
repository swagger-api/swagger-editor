// Converts an object of environment variables into a Swagger Editor config object
const configSchema = require("./variables")

const defaultBaseConfig = {
  dom_id: {
    value: "#swagger-editor",
    schema: {
      type: "string",
      base: true
    }
  },
  presets: {
    value: `[\n  SwaggerEditorStandalonePreset\n]`,
    schema: {
      type: "array",
      base: true
    }
  },
  layout: {
    value: "StandaloneLayout",
    schema: {
      type: "string",
      base: true
    }
  }
}

function objectToKeyValueString(env, { injectBaseConfig = false, schema = configSchema, baseConfig = defaultBaseConfig } = {}) {
  let valueStorage = injectBaseConfig ? Object.assign({}, baseConfig) : {}
  const keys = Object.keys(env)

  // Compute an intermediate representation that holds candidate values and schemas.
  // 
  // This is useful for deduping between multiple env keys that set the same
  // config variable.

  keys.forEach(key => {
    const varSchema = schema[key]
    const value = env[key]
    
    if(!varSchema) return

    if(varSchema.onFound) {
      varSchema.onFound()
    }

    const storageContents = valueStorage[varSchema.name]

    if(storageContents) {
      if (varSchema.legacy === true && !storageContents.schema.base) {
        // If we're looking at a legacy var, it should lose out to any already-set value
        // except for base values
        return
      }
      delete valueStorage[varSchema.name]
    }

    valueStorage[varSchema.name] = {
      value,
      schema: varSchema
    }
  })

  // Compute a key:value string based on valueStorage's contents.

  let result = ""

  Object.keys(valueStorage).forEach(key => {
    const value = valueStorage[key]
    
    const escapedName = /[^a-zA-Z0-9]/.test(key) ? `"${key}"` : key 

    if (value.schema.type === "string") {
      result += `${escapedName}: "${value.value}",\n`
    } else {
      result += `${escapedName}: ${value.value === "" ? `undefined` : value.value},\n`
    }
  })

  return result.trim()
}

module.exports = objectToKeyValueString