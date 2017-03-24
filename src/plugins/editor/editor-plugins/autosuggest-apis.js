import last from "lodash/last"
import { makeAutosuggest, getPathForPosition } from "./autosuggest-helpers/core"
import { getSnippetsForPath } from "./autosuggest-helpers/snippet-helpers"
import { getKeywordsForPath, getContextType } from "./autosuggest-helpers/keyword-helpers"
import { buildSuggestions, parseDomain } from "./autosuggest-helpers/hub-ref-helpers.hub.js"
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

  let HubRefCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true

      let editorValue = session.getValue()

      let path = getPathForPosition({ pos, prefix, editorValue, AST })

      if(last(path) === "$ref") {
        let type = getContextType(path)
        fetchDomainSuggestions(path, prefix, type)
          .then(res => {
            let suggestions = res.apis.reduce( function( prev, rawDomain, i ){
              var domain = parseDomain( rawDomain, i )
              return buildSuggestions( domain, i, type).concat( prev )
            }, [] )
            callback(null, suggestions)
          })
      } else {
        callback(null, [])
      }
    }
  }

  return makeAutosuggest({
    completers: [SnippetCompleter, KeywordCompleter, HubRefCompleter]
  })(editor, {fetchDomainSuggestions}, { langTools, AST, specObject })
}
