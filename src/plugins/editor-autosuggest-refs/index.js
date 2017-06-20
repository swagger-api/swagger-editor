import * as wrapActions from "./wrap-actions"

export default function EditorAutosuggestRefsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions,
      }
    }
  }
}
