import { createSelector } from "reselect"
import { Set, Map } from "immutable"

const REF_TYPES = {
  "paths": "pathitems",
  "definitions": "definitions",
  "schema": "definitions",
  "parameters": "parameters",
  "responses": "responses"
}

const TYPES = Set(Object.values(REF_TYPES))

// Return a normalized "type" for a given path [a,b,c]
// eg: /definitions/bob => definition
//     /paths/~1pets/responses/200/schema => definition ( because of schema )
export function getRefType(_, path) {
  for( var i=path.length-1; i>-1; i-- ) {
    let tag = path[i]

    if( REF_TYPES[tag] ) {
      return REF_TYPES[tag]
    }
  }
  return null
}

export const localRefs = (state) => (sys) => createSelector(
  sys.specSelectors.spec,
  spec => {
    return TYPES.toList().flatMap( type => {
      return spec
        .get(type, Map({}))
        .keySeq()
        .map( name => Map({
          name,
          type,
          $ref: `#/${type}/${name}`,
        }))
    })
  }
)(state)
