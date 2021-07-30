import { addAutosuggestionCompleters } from "./wrap-actions"

export default function EditorAutosuggestKeywordsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions: { addAutosuggestionCompleters },
      }
    }
  }
}
