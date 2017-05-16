import isArray from "lodash/isArray"
import keywordMap from "./keyword-map"
import getKeywordsForPath from "./get-keywords-for-path"

export const getCompletions = (ori, system) => (...args) => {
  ori(...args)
  // (ctx, editor, session, pos, prefix, cb)
  const [ctx, editor,, pos, prefix, cb] = args
  const { fn: { getPathForPosition } } = system
  const { AST } = ctx
  const editorValue = editor.getValue()
  const currentLine = editorValue.split("\n")[pos.row]

  const path = getPathForPosition({ pos, prefix, editorValue, AST})
  const suggestions = getKeywordsForPath({ system, path, prefix, currentLine, editorValue, keywordMap })

  if(isArray(suggestions) && suggestions.length) {
    cb(null, suggestions)
  }
}
