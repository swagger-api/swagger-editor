import { addAutosuggestionCompleters } from "./wrap-actions"

export default function EditorAutosuggestOAS3KeywordsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions: { addAutosuggestionCompleters },
      }
    }
  }
}
