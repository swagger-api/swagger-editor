import get from "lodash/get"
import { escapeJsonPointerToken } from "../../refs-util"

// Add warnings for unused definitions
export const validateUnusedDefinitions = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((nodes) => {
    const references = nodes.map(node => node.node)
    const errors = []

    system.specSelectors.definitions()
    .forEach((val, key) => {
      key = escapeJsonPointerToken(key)
      if(references.indexOf(`#/definitions/${key}`) < 0) {
        const path = ["definitions", key]
        errors.push({
          level: "warning",
          path,
          message: "Definition was declared but never used in document"
        })
      }
    })

    return errors
  })
}

export const validateRefPathFormatting = () => (system) => {
  return system.validateSelectors.all$refs()
  .then((refArtifacts) => {

    const errors = []
    refArtifacts.forEach((node) => {
      const value = node.node
      if(typeof value === "string") {
        // eslint-disable-next-line no-unused-vars
        const [refUrl, refPath] = value.split("#")

        if(!refPath || refPath[0] !== "/") {
          errors.push({
            // $ref instead of $$ref
            path: [...node.path.slice(0, -1), "$ref"],
            message: "$ref paths must begin with `#/`",
            level: "error"
          })
        }
      }
    })

    return errors
  })
}
