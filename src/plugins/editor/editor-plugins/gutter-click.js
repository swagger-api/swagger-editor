import isFunction from "lodash/isFunction"

export default function(editor, { onGutterClick }) {
  editor.on("guttermousedown", (e) => {
    let editor = e.editor
    let line = e.getDocumentPosition().row
    let region = editor.renderer.$gutterLayer.getRegion(e)

    e.stop()

    if(isFunction(onGutterClick)) {
      onGutterClick({ region, line })
    }

  })
}
