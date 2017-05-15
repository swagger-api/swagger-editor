import * as wrapActions from "./wrap-actions"

export default function EditorAutosuggestSnippetsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions,
      }
    }
  }
}
