import { addAutosuggestionCompleters } from "./wrap-actions"

export default function EditorAutosuggestRefsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions: { addAutosuggestionCompleters },
      }
    }
  }
}
