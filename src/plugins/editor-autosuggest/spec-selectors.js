import { createSelector } from "reselect"
import { Set, Map } from "immutable"
import { escapeJsonPointerToken } from "../refs-util"

const SWAGGER2_REF_MAP = {
  "paths": "pathitems",
  "definitions": "definitions",
  "schema": "definitions",
  "parameters": "parameters",
  "responses": "responses"
}

const OAS3_REF_MAP = {
  schemas: "components/schemas", // for Schemas within Components
  schema: "components/schemas", // for Schemas throughout document
  parameters: "components/parameters",
  requestBody: "components/requestBodies",
  callbacks: "components/callbacks",
  examples: "components/examples",
  responses: "components/responses",
  headers: "components/headers",
  links: "components/links"
}

const SWAGGER2_TYPES = Set(Object.values(SWAGGER2_REF_MAP))
const OAS3_TYPES = Set(Object.values(OAS3_REF_MAP))

// Return a normalized "type" for a given path [a,b,c]
// eg: /definitions/bob => definition
//     /paths/~1pets/responses/200/schema => definition ( because of schema )
export const getRefType = (state, path) => (sys) => createSelector(
  () => {
  for( var i=path.length-1; i>-1; i-- ) {
    let tag = path[i]
    if(sys.specSelectors.isOAS3 && sys.specSelectors.isOAS3()) {
      if(OAS3_REF_MAP[tag]) {
        return OAS3_REF_MAP[tag]
      }
    } else if( SWAGGER2_REF_MAP[tag] ) {
      return SWAGGER2_REF_MAP[tag]
    }
  }
  return null
})(state)

export const localRefs = (state) => (sys) => createSelector(
  sys.specSelectors.spec,
  sys.specSelectors.isOAS3 || (() => false),
  (spec, isOAS3) => {
    return (isOAS3 ? OAS3_TYPES : SWAGGER2_TYPES).toList().flatMap( type => {
      return spec
        .getIn(type.split("/"), Map({}))
        .keySeq()
        .map( name => Map({
          name,
          type,
          $ref: `#/${type}/${escapeJsonPointerToken(name)}`,
        }))
    })
  }
)(state)
