import * as selectors from "./selectors"
import * as actions from "./actions"
import traverse from "traverse"
import {createSelector} from "reselect"
import { fromJS } from "immutable"

export default function SemanticValidatorsPlugin() {
  return {
    fn: {
      traverse
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
            system.validateActions.all(...args)
          }
        }
      },
      validate: {
        selectors,
        actions,
      },
    }
  }
}

// // In another file, far away...
// export const validate_ArraysWithSchemas = (nodeSelectors, cb) => {
//   const idsSeen = new Set()
//   nodeSelectors.allOperationIds().forEach(({value, path}) => {
//     if(idsSeen.has(value)) {
//       cb({
//         level: 'error',
//         message: 'Ids need to be unique',
//         path ,
//       })
//     }
//     idsSeen.add(id)
//   })
// }

// export const updateResolved = (ori, system) => (...args) => {
//   ori(...args)
//   system.validationActions.runValidationActions(...args)
// }

// export const runValidationActions = (spec) => {
//   const nodeSelectors = system.nodeSelectors
//   const cb = system.errActions.newErr
//   forEach(
//     system.validatorActions,
//     (fn, name) => name.indexOf("validation_") === 0 ? fn(nodeSelectors, cb) : null
//   )
// }


// export const allDefinitionsNodes = createSelector(
//   state => state.get('definitions'),
//   (defs) => {
//     defs.toJS()
//   }
// )
// export const allDefinitionsNodes = (state, json) => (system) => {
//   const nodes = []
//   system.fn.traverse(json, () => {
//     nodes.push({
//       key: this.key,
//       value: this.value,
//       path: this.path,
//       parent: this.parent // not postmessage safe
//     })
//   })
// }


// // In another file, far away...
// export const validate_UnusedDefs = () => (system) => {
//   const { allDefinitionsNodes, all$refsNodes } = system.specSelectors
//   const { errActions } = system
//   const allRefs = all$refsNodes()
//   allDefinitionsNodes().forEach(({value, path}) => {
//     if(!allRefs.some(a => a.value === value)) {
//       errActions.newErr({
//         level: "warning",
//         path,
//         message: "Unsused definition " + value
//       })
//     }
//   })
// }

//      validate: (definitions, $refs) => {
//        // each `definition` and `$ref` here is a node, as defined in the popular https://github.com/substack/js-traverse
//        // eg: .value is the value, .path is an array of tokens, .parent is the parent _node_ etc.
//        definitions.forEach(def => {
//          if(!$refs.some($ref => $ref.value === def.value)) {
//            const message = 'This definition isn\'t used anywhere in this spec: '
//            const path = def.path
//            system.errActions.newErr({ level: "warning", path, message})
//          }
//        })
//      }
//    }

//    return rules
//  }
// }

//  export const validatationRules = (ori, system) = (...args) => {
//    const rules = ori(...args)
//    const { allOperationIds } = system.nodeSelectors

//    rules['arrays-without-schemas'] = (system) => {

//      system.specSelectors.allOperationIdsNodes().forEach(id => {
//      })
//    }
//      nodeSelectors: [allSchemas],
//      validate: (ids) => {
//        ids.forEach()
//        schemas.forEach({path, value} => {
//          if(value.type === "array" && isUndefined(value.items)) {
//            const message = 'All schemas of "type: array" require a relative "items: <schema>"'
//            system.errActions.newErr({ level: "error", path, message})
//          }
//        })
//      }
//    }

//    return rules
//  }
