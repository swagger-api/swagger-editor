import makeEditor from "./components/editor"
import EditorContainer from "./components/editor-container"
import JumpToPath from "./components/jump-to-path"
import * as actions from "./actions"
import reducers from "./reducers"
import * as selectors from "./selectors"

let Editor = makeEditor({
  editorPluginsToRun: ["autosuggestApis", "gutterClick", "jsonToYaml", "pasteHandler"]
})

export default function () {
  return {
    components: { Editor, EditorContainer, JumpToPath },
    statePlugins: {
      editor: {
        reducers,
        actions,
        selectors
      }
    }
  }
}
