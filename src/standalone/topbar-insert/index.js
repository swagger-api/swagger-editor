import { OrderedMap, List } from "immutable"

import TopbarInsert from "./topbar-insert"
import TopbarModal from "./modal/Modal"

export default function () {
  const ADD_TO_SPEC = "add_to_spec"

  return {
    components: {
      TopbarInsert,
      TopbarModal
    },
    statePlugins: {
      spec: {
        actions: {
          addToSpec: (path, item, key) => ({ 
            type: ADD_TO_SPEC,
            payload: { path, item, key }
          })         
        },
        reducers: {
          [ADD_TO_SPEC]: (state, { payload }) => {    
            const { path, item, key } = payload
            let currentItem = state.getIn(["json", ...path])

            if (!currentItem) {
              currentItem = key ? new OrderedMap({ [key]: item }) : new List()
            }
            
            currentItem = key ? currentItem.set(key, item) : currentItem.concat(item)
                        
            return state.setIn(["json", ...path], currentItem)
          }
        }
      }
    }
  }
}
