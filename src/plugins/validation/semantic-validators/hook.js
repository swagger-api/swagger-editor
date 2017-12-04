import concat from "lodash/concat"
import reduce from "lodash/reduce"
import isArray from "lodash/isArray"
import { transformPathToArray } from "../path-translator"

import assign from "lodash/assign"
import getTimestamp from "../get-timestamp"
import rawValidators from "./validators"
let semanticValidators = []

let LOG_SEMVAL_PERF = process.env.NODE_ENV !== "production"

Object.keys(rawValidators).forEach( function( key ) {
  semanticValidators.push({
    name: toTitleCase(key).replace(".js", "").replace("./", ""),
    validate: rawValidators[key]
  })
})

export function runSemanticValidators ({jsSpec, resolvedSpec, getLineNumberForPath, specStr}) {
  let semanticValidatorsOutput = semanticValidators.map( (sv) => {
    if(LOG_SEMVAL_PERF) {
      var t0 = getTimestamp()
    }

    var res

    try {
      res = sv.validate({
        jsSpec: assign({}, jsSpec),
        specStr,
        resolvedSpec: assign({}, resolvedSpec)
      })

    } catch (e) {
      console.error(`Semantic validator ${sv.name} had a problem: `, e)
      res = {
        errors: [],
        warnings: []
      }
    }

    if(LOG_SEMVAL_PERF) {
      var t1 = getTimestamp()
      // eslint-disable-next-line no-console
      console.log(`SemVal: ${sv.name} took ${Math.ceil((t1 * 10) - (t0 * 10))/10}ms`)
    }

    res.errors.forEach(err => {
      // transform path strings into line numbers! it's magic!
      if(err.path && !err.line) {
        err.line = (getLineNumberForPath(isArray(err.path) ? err.path : transformPathToArray(err.path, jsSpec)))
      }
    })

    res.warnings.forEach(err => {
      // transform path strings into line numbers! it's magic!
      if(err.path && !err.line) {
        err.line = (getLineNumberForPath(isArray(err.path) ? err.path : transformPathToArray(err.path, jsSpec)))
      }
    })

    res.name = sv.name
    return res
  })

  let flattenedOutput = reduce(semanticValidatorsOutput, (res, val) => {
    let errors = val.errors.map(err => {
      err.source = "semantic"
      err.level = "error"
      return err
    })

    let warnings = val.warnings.map(warning => {
      warning.source = "semantic"
      warning.level = "warning"
      return warning
    })

    return concat(res, errors, warnings)
  }, [])

  return flattenedOutput

}

function toTitleCase(str) {
  return str
    .split("-")
    .map(substr => substr[0].toUpperCase() + substr.slice(1))
    .join("")
}
