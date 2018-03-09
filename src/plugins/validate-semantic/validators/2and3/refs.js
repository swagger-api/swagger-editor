import get from "lodash/get"

export const validate2And3RefHasNoSiblings = () => system => {
  return system.validateSelectors.all$refs()
  .then((nodes) => {
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
