export default function(editor) {
  // NOTE: react-ace has an onPaste prop.. we could refactor to that.
  editor.on("paste", e => {
    // replace all U+0009 tabs in pasted string with two spaces
    e.text = e.text.replace(/\t/g, "  ")
  })
}
