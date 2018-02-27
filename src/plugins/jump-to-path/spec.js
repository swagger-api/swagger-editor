import { unescapeJsonPointerToken } from "../refs-util"

export default function spec() {
  return {
    statePlugins: {
      spec: {
        selectors: {

          getSpecLineFromPath: (state, path) => ({fn: { AST }, specSelectors: { specStr }}) => {
            return AST.getLineNumberForPath(specStr(), path.toJS ? path.toJS() : path)
          },

          // This will search return `path if it exists, else it'll look for the best $ref jump point
          // There is one caveat, it'll not search _down_ for deeply nested $refs. In those cases, it'll bring you to the shallower $ref.
          bestJumpPath: (state, {path, specPath}) => (system) => {
            const {
              specSelectors: { specJson },
              fn: { transformPathToArray }
            } = system

            // We"ve been given an explicit path? Use that...
            if(path) {
              return typeof path === "string" ? transformPathToArray(path, specJson().toJS()) : path
            }

            // Try each path in the resolved spec, starting from the deepest
            for(let i = specPath.length; i >= 0; i--) {
              const tryPath = specPath.slice(0,i)

              // A $ref exists in the source? ( ie: pre-resolver)
              const $ref = specJson().getIn([...tryPath, "$ref"])
              // We have a $ref in the source?
              if($ref) {
                if(!/^#\//.test($ref)) {
                  return [...tryPath, "$ref"]
                } else { // Is local $ref
                  // Get rid of the trailing '#'
                  const pointer = $ref.charAt(0) === "#" ? $ref.substr(1) : $ref
                  return jsonPointerToArray(pointer)
                }
              }

              // This path exists in the source spec?
              if(specJson().hasIn(tryPath)) {
                return tryPath
              }
            }

            // ...else just specPath, which is hopefully close enough
            return specPath
          }
        }
      }
    }
  }
}

// Copied out of swagger-client, not sure if it should be exposed as a lib or as part of the public swagger-client api.
/**
 * Converts a JSON pointer to array.
 * @api public
 */
function jsonPointerToArray(pointer) {
  if (typeof pointer !== "string") {
    throw new TypeError(`Expected a string, got a ${typeof pointer}`)
  }

  if (pointer[0] === "/") {
    pointer = pointer.substr(1)
  }

  if (pointer === "") {
    return []
  }

  return pointer.split("/").map(unescapeJsonPointerToken)
}
