//import PetstoreYaml from "./petstore"
import { petStoreOas3Def } from "../default-definitions"
const CONTENT_KEY = "swagger-editor-content"

let localStorage = window.localStorage

export const updateSpec = (ori) => (...args) => {
  let [spec] = args
  ori(...args)
  saveContentToStorage(spec)
}

export default function(system) {
  // setTimeout runs on the next tick
  setTimeout(() => {
    if(localStorage.getItem(CONTENT_KEY)) {
      system.specActions.updateSpec(localStorage.getItem(CONTENT_KEY), "local-storage")
    } else if(localStorage.getItem("ngStorage-SwaggerEditorCache")) {
      // Legacy migration for swagger-editor 2.x
      try {
        let obj = JSON.parse(localStorage.getItem("ngStorage-SwaggerEditorCache"))
        let yaml = obj.yaml
        system.specActions.updateSpec(yaml)
        saveContentToStorage(yaml)
        localStorage.setItem("ngStorage-SwaggerEditorCache", null)
      } catch(e) {
        system.specActions.updateSpec(petStoreOas3Def)
      }
    } else {
      system.specActions.updateSpec(petStoreOas3Def)
    }
  }, 0)
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec
        }
      }
    }
  }
}

function saveContentToStorage(str) {
  return localStorage.setItem(CONTENT_KEY, str)
}
