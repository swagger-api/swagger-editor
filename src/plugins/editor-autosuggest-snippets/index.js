import getCompletionsSync from "./get-completions-sync"

export default function EditorAutosuggestSnippetsPlugin() {
  return {
    statePlugins: {
      editor: {
        wrapActions: {
          getCompletionsSync
        }
      }
    }
  }
}
