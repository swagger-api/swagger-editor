import * as wrapActions from "./wrap-actions"

export default function EditorAutosuggestKeywordsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions,
      }
    }
  }
}
