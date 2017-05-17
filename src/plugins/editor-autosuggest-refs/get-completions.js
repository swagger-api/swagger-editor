import getRefsForPath from "./get-refs-for-path"

export default function getCompletions(editor, session, pos, prefix, cb, ctx, system) {

  const { fn: { getPathForPosition } } = system
  const { AST } = ctx
  var editorValue = editor.getValue()
  const path = getPathForPosition({ pos, prefix, editorValue, AST})

  const suggestions = getRefsForPath({ system, path})
  cb(null, suggestions)
}
