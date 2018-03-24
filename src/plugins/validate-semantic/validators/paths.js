import {
  PATH_TEMPLATES_REGEX
} from "./helpers"

export const validatePathParameterDeclarationIsNotEmpty = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const pathTemplates = (node.key.match(PATH_TEMPLATES_REGEX) || [])
          .map(str => str.replace("{", "").replace("}", ""))

        const emptyPathTemplates = pathTemplates.filter(v => !v.length)

        if(emptyPathTemplates.length) {
          acc.push({
            message: `Empty path parameter declarations are not valid`,
            path: [...node.path],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

export const validatePathParameterKeysAreDifferent = () => system => {
  return system.validateSelectors
    .allPathItems()
    .then(nodes => {
      const seen = []
      return nodes.reduce((acc, node) => {
        const realPath = node.key.replace(PATH_TEMPLATES_REGEX, "~~")
        if(seen.indexOf(realPath) > -1) {
          acc.push({
            message: `Equivalent paths are not allowed.`,
            path: [...node.path],
            level: "error",
          })
        }
        seen.push(realPath)
        return acc
      }, [])
    })
}
