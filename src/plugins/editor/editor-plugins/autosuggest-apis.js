import { makeAutosuggest, getPathForPosition } from "./autosuggest-helpers/core"
import { getSnippetsForPath } from "./autosuggest-helpers/snippet-helpers"
import { getKeywordsForPath } from "./autosuggest-helpers/keyword-helpers"
import keywordMap from "./autosuggest-helpers/keyword-map"
import snippets from "./autosuggest-helpers/snippets"

export default function(editor, { fetchDomainSuggestions }, { langTools, AST, specObject }) {
  let SnippetCompleter = {
    // this method is being called by Ace to get a list of completion candidates
    getCompletions: function(editor, session, pos, prefix, callback) {
      // Let Ace select the first candidate
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let path = getPathForPosition({ pos, prefix, editorValue, AST })

      callback(null, getSnippetsForPath({ path, snippets }))
    }
  }

  let KeywordCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let currentLine = editorValue.split("\n")[pos.row]

      let path = getPathForPosition({ pos, prefix, editorValue, AST })

      callback(null, getKeywordsForPath({ path, prefix, currentLine, editorValue, keywordMap }))
    }
  }

  return makeAutosuggest({
    completers: [SnippetCompleter, KeywordCompleter]
  })(editor, {fetchDomainSuggestions}, { langTools, AST, specObject })
}
