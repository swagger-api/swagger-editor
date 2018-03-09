export const validate2And3PathParameterKeysDontContainQuestionMarks = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        if(node.key.indexOf("?") > -1) {
          acc.push({
            message: `Query strings in paths are not allowed.`,
            path: [...node.path],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}
