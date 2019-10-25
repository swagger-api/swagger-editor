import {
  checkForDefinition,
  PATH_TEMPLATES_REGEX
} from "../helpers"

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

export const validate2And3PathParameterDeclarationHasMatchingDefiniton = () => async system => {
  const nodes = await system.validateSelectors.allPathItems()

  return nodes.reduce(async (prev, node) => {
    const acc = await prev
    const pathTemplates = (node.key.match(PATH_TEMPLATES_REGEX) || [])
      .map(str => str.replace("{", "").replace("}", ""))
    if(pathTemplates.length) {
      for (let paramName of pathTemplates) {
        if(paramName.length === 0) {
          // don't validate empty param names... they're invalid anyway
          continue
        }
        const resolverResult = await system.fn.memoizedResolveSubtree(system.specSelectors.specJson(), node.path)
        const res = checkForDefinition(paramName, resolverResult.spec)
        if(res.inOperation && res.missingFromOperations.length) {
          const missingStr = res.missingFromOperations
            .map(str => `"${str}"`)
            .join(", ")

          acc.push({
            message: `Declared path parameter "${paramName}" needs to be defined within every operation in the path (missing in ${missingStr}), or moved to the path-level parameters object`,
            path: [...node.path],
            level: "error",
          })
        } else if(res.caseMatch) {
          acc.push({
            message: `Parameter names are case-sensitive. The parameter named "${res.paramCase}" does not match the case used in the path "${node.key}".`,
            path: [...node.path],
            level: "error",
          })
        } else if(!res.found) {
          acc.push({
            message: `Declared path parameter "${paramName}" needs to be defined as a path parameter at either the path or operation level`,
            path: [...node.path],
            level: "error",
          })
        }
      }
    }
    return acc
  }, Promise.resolve([]))
}
