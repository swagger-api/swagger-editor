import * as selectors from "./selectors"
import * as actions from "./actions"
import traverse from "traverse"
import {createSelector} from "reselect"
import debounce from "lodash/debounce"
import memoize from "lodash/memoize"

import * as formDataValidateActions from "./validators/form-data"
import * as schemaValidateActions from "./validators/schema"
import * as pathsValidateActions from "./validators/paths"
import * as securityValidateActions from "./validators/security"
import * as parametersValidateActions from "./validators/parameters"
import * as operationsOAS3ValidateActions from "./validators/oas3/operations"
import * as parametersOAS3ValidateActions from "./validators/oas3/parameters"
import * as componentsOAS3ValidateActions from "./validators/oas3/components"
import * as refsOAS3ValidateActions from "./validators/oas3/refs"
import * as refs2and3ValidateActions from "./validators/2and3/refs"
import * as parameters2and3ValidateActions from "./validators/2and3/parameters"
import * as paths2and3ValidateActions from "./validators/2and3/paths"
import * as schemas2and3ValidateActions from "./validators/2and3/schemas"
import * as operations2and3ValidateActions from "./validators/2and3/operations"
import * as security2and3ValidateActions from "./validators/2and3/security"
import * as tags2and3ValidateActions from "./validators/2and3/tags"

export default function SemanticValidatorsPlugin({getSystem}) {

  const debAll = debounce((system) => system.validateActions.all(), 300)
  const traverseOnce = makeTraverseOnce(getSystem)

  return {
    fn: {
      traverse,
      traverseOnce,
      memoizedResolveSubtree: makeMemoizedResolveSubtree(getSystem())
    },
    statePlugins: {
      spec: {
        selectors: {
          jsonAsJS: createSelector(
            state => state.get("json"),
            (spec) => spec ? spec.toJS() : null
          )
        },
        wrapActions: {
          validateSpec: (ori, system) => (...args) => {
            // verify editor plugin already loaded and function is available (for tests)
            if (system.specSelectors.specOrigin) {
              const specOrigin = system.specSelectors.specOrigin()
              if (specOrigin === "editor") {
                ori(...args)
                debAll(system)
              }
            }
          }
        }
      },
      validate: {
        selectors,
        actions: {
          ...actions,
          ...formDataValidateActions,
          ...schemaValidateActions,
          ...pathsValidateActions,
          ...securityValidateActions,
          ...parametersValidateActions,
          ...operations2and3ValidateActions,
          ...refs2and3ValidateActions,
          ...operationsOAS3ValidateActions,
          ...parametersOAS3ValidateActions,
          ...componentsOAS3ValidateActions,
          ...refsOAS3ValidateActions,
          ...parameters2and3ValidateActions,
          ...paths2and3ValidateActions,
          ...schemas2and3ValidateActions,
          ...security2and3ValidateActions,
          ...tags2and3ValidateActions
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

    const system = getSystem()

    const json = system.specSelectors.jsonAsJS()

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

function makeMemoizedResolveSubtree(system) {
  const cacheKeymaker = (obj, path) => {
    return `${obj.toString()} ${path.join("<>")}`
  }
  return memoize(async (obj, path, opts) => {
    const res = await system.fn.resolveSubtree(obj.toJS(), path, opts)
    return res
  }, cacheKeymaker)
}
