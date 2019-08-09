export const validate2And3TagObjectsHaveUniqueNames = () => (system) => {
  return system.validateSelectors
    .allTags()
    .then(nodes => {
      const seenNames = []
      return nodes.reduce((acc, node) => {
        const tagObj = node.node
        const { name } = tagObj || {}
        if(!name || seenNames.indexOf(name) > -1) {
          acc.push({
            message: "Tag Objects must have a unique `name` field value.",
            path: node.path,
            level: "error",
          })
        } else {
          seenNames.push(name)
        }
        return acc
      }, [])
    })
}
