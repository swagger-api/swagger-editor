import isArray from "lodash/isArray"
import getRefsForPath from "./get-refs-for-path"

export const getCompletions = (ori, system) => (...args) => {
  ori(...args)
  // (ctx, editor, session, pos, prefix, cb)
  const [ctx, editor,, pos, prefix, cb] = args
  const { fn: { getPathForPosition } } = system
  const { AST } = ctx
  const editorValue = editor.getValue()
  const currentLine = editorValue.split("\n")[pos.row]

  const path = getPathForPosition({ pos, prefix, editorValue, AST})
  const suggestions = getRefsForPath({ system, path, prefix, currentLine})

  if(isArray(suggestions) && suggestions.length) {
    cb(null, suggestions)
  }
}
