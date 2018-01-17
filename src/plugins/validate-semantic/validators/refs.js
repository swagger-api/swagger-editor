import get from "lodash/get"

export const validateRefHasNoSiblings = () => system => {
  return Promise.all([
    system.validateSelectors.all$refArtifacts(),
  ]).then(([nodes]) => {
      const immSpecJson = system.specSelectors.specJson()
      const specJson = immSpecJson.toJS ? immSpecJson.toJS() : {}

      return nodes.reduce((acc, node) => {
        const unresolvedValue = get(specJson, node.parent.path) || {}
        const unresolvedKeys = Object.keys(unresolvedValue) || []


        unresolvedKeys.forEach(k => {
          if(k !== "$ref" && unresolvedKeys.indexOf("$ref") > -1) {
            acc.push({
              message: `Sibling values are not allowed alongside $refs`,
              path: [...node.path.slice(0, -1), k],
              level: "warning"
            })
          }
        })
        return acc
      }, [])
    })
}

// Add warnings for unused definitions
export const validateUnusedDefinitions = () => (system) => {
  return Promise.all([
    system.validateSelectors.all$refs(),
    system.validateSelectors.all$refArtifacts()
  ]).then(([refs, refArtifacts]) => {
    const references = (
      (refs.length ? refs : null)
      || (refArtifacts.length ? refArtifacts : null)
      || []
    ).map(node => node.node)

    const errors = []

    system.specSelectors.definitions()
    .forEach((val, key) => {
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
