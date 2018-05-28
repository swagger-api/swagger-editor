import makeEditor from "./components/editor"
import EditorContainer from "./components/editor-container"
import * as actions from "./actions"
import reducers from "./reducers"
import * as selectors from "./selectors"
import EditorSpecPlugin from "./spec"

let Editor = makeEditor({
  editorPluginsToRun: ["gutterClick", "jsonToYaml", "pasteHandler"]
})

export default function () {
  return [EditorSpecPlugin, {
    components: { Editor, EditorContainer },
    statePlugins: {
      editor: {
        reducers,
        actions,
        selectors
      }
    }
  }]
}
