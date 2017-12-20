import * as selectors from "./selectors"
import * as actions from "./actions"
import traverse from "traverse"
import {createSelector} from "reselect"
import { fromJS } from "immutable"
import debounce from "lodash/debounce"

import * as formDataValidateActions from "./validators/form-data"

export default function SemanticValidatorsPlugin({getSystem}) {

  const debAll = debounce((system) => system.validateActions.all(), 300)
  const traverseOnce = makeTraverseOnce(getSystem)

  return {
    fn: {
      traverse,
      traverseOnce,
    },
    statePlugins: {
      spec: {
        selectors: {
          jsonAsJS: createSelector(
            state => state.get("resolvedSpec"),
            state => state.get("json"),
            (a,b) => (a || b).toJS()
          ),
          definitions: createSelector(
            state => state.getIn(["json", "definitions"]),
            (defs) => defs || fromJS({})
          ),
        },
        wrapActions: {
          validateSpec: (ori, system) => (...args) => {
            ori(...args)
            debAll(system)
          }
        }
      },
      validate: {
        selectors,
        actions: {
          ...actions,
          ...formDataValidateActions
        }
      },
    }
  }
}

function makeTraverseOnce(getSystem) {
  let traversers = {}
  let results = {}
  let deferred = null

  const debTraverse = debounce(() => {
    // Setup collections
    for(let name in traversers) {
      results[name] = []
    }

    const json = getSystem().specSelectors.jsonAsJS()

    getSystem().fn.traverse(json)
      .forEach(function() { // Remember: this cannot be a fat-arrow function, because we need to read "this"
        for(let name in traversers) {
          const fn = traversers[name]
          const fnRes = fn(this)
          if(fnRes) {
            results[name].push(fnRes)
          }
        }
      })

    deferred.resolve(results)
    deferred = null

    traversers = {}
    results = {}
  }, 20) // 20ms might be more than enough, since most of these are called immediately (within a tick)

  const defer = () => {
    let d = {}
    d.promise = new Promise((resolve, reject) => {
      d.resolve = resolve
      d.reject = reject
    })
    return d
  }

  return ({fn, name}) => {
    traversers[name] = fn
    deferred = deferred || defer()
    debTraverse()
    return deferred.promise.then( a => a[name] )
  }
}
