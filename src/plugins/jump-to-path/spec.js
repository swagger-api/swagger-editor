export default function spec() {
  return {
    statePlugins: {
      spec: {
        selectors: {

          getSpecLineFromPath: (state, path) => ({fn: { AST }, specSelectors: { specStr }}) => {
            return AST.getLineNumberForPath(specStr(), path)
          },

          bestJumpPath: (state, {path, specPath}) => (system) => {
            const {
              specSelectors: { specJson },
              fn: { transformPathToArray }
            } = system

            const pathAr = path === "string" ? transformPathToArray(path, specJson().toJS()) : path
            const jumpPath = specJson().hasIn(pathAr)
                  ? pathAr
                  : specJson().hasIn([...specPath, "$ref"])
                  ? [...specPath, "$ref"]
                  : specPath

            return jumpPath
          }
        }
      }
    }
  }
}
