export const validateRefHasNoSiblings = () => system => {
  return system.validateSelectors
    .all$refs()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const parentValue = node.notRoot ? node.parent.node : null
        const parentKeys = Object.keys(parentValue) || []

        parentKeys.forEach(k => {
          if(k !== "$ref") {
            acc.push({
              message: `Sibling values are not allowed alongside $refs`,
              path: [...node.path.slice(0, -1), k],
              level: "error"
            })
          }
        })
        return acc
      }, [])
    })
}

// Add warnings for unused definitions
export const validateUnused$Refs = () => (system) => {
  return Promise.all([
    system.validateSelectors.all$refs(),
    system.validateSelectors.all$refArtifacts()
  ]).then(([refs, refArtifacts]) => {
    const references = (refs || refArtifacts || []).map(node => node.node)
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
