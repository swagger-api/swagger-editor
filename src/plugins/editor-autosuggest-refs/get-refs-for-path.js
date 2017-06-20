import isArray from "lodash/isArray"
import last from "lodash/last"

export default function getRefsForPath({ system, path }) {

  // Note fellow ace hackers:
  // we have to be weary of _what_ ace will filter on, see the order ( probably should be fixed, but... ): https://github.com/ajaxorg/ace/blob/b219b5584456534fbccb5fb20470c61011fa0b0a/lib/ace/autocomplete.js#L469
  // Because of that, I'm matching on `caption` and using `snippet` instead of `value` for injecting
  if(isArray(path) && last(path) === "$ref") {
    const localRefs = system.specSelectors.localRefs()
    const refType = system.specSelectors.getRefType(path)
    return localRefs
      .filter(r => r.get("type") == refType)
      .toJS()
      .map(r => ({
        score: 100,
        meta: "local",
        snippet: `'${r.$ref}'`, // wrap in quotes
        caption: r.name,
      }))
  }

  return []
}
