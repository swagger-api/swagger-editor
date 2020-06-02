import { OrderedMap, List } from "immutable"

import TopbarInsert from "./topbar-insert"
import TopbarModal from "./modal/Modal"

import InsertDropdown from "./dropdown/Dropdown"
import InsertDropdownItem from "./dropdown/DropdownItem"
import AddForm from "./forms/components/AddForm"
import FormChild from "./forms/components/FormChild"
import FormDropdown from "./forms/components/FormDropdown"
import FormInput from "./forms/components/FormInput"
import FormInputWrapper from "./forms/components/FormInputWrapper"
import FormMap from "./forms/components/FormMap"
import InsertForm from "./forms/components/InsertForm"
import InsertFormInput from "./forms/components/InsertFormInput"
import InsertFormList from "./forms/components/InsertFormList"

export default function () {
  const ADD_TO_SPEC = "add_to_spec"

  return {
    components: {
      TopbarInsert,
      TopbarModal,
      InsertDropdown,
      InsertDropdownItem,
      AddForm,
      FormChild,
      FormDropdown,
      FormInput,
      FormInputWrapper,
      FormMap,
      InsertForm,
      InsertFormInput,
      InsertFormList
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
