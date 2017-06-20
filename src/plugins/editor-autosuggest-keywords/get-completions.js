import keywordMap from "./keyword-map"
import getKeywordsForPath from "./get-keywords-for-path"

export default function getCompletions(editor, session, pos, prefix, cb, ctx, system) {

  const { fn: { getPathForPosition } } = system
  const { AST } = ctx
  var editorValue = editor.getValue()
  const path = getPathForPosition({ pos, prefix, editorValue, AST})

  const suggestions = getKeywordsForPath({ system, path, keywordMap })
  cb(null, suggestions)
}
