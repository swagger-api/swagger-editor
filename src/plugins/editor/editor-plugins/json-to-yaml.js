import YAML from "js-yaml"

export default function(editor) {
  editor.on("paste", e => {
    const originalStr = e.text
    if (!isJSON(originalStr)) {
      return
    }

    let yamlString
    try {
      yamlString = YAML.dump(YAML.load(originalStr), {
        lineWidth: -1 // don't generate line folds
      })
    } catch (e) {
      return
    }

    if (!confirm("Would you like to convert your JSON into YAML?")) {
      return
    }

    // using SelectionRange instead of CursorPosition, because:
    // SR.start|end === CP when there's no selection
    // and it catches indentation edge cases when there is one
    const padding = makePadding(editor.getSelectionRange().start.column)

    // update the pasted content
    e.text = yamlString
      .split("\n")
      .map((line, i) => i == 0 ? line : padding + line) // don't pad first line, it's already indented
      .join("\n")
      .replace(/\t/g, "  ") // tabs -> spaces, just to be sure
  })
}

function isJSON (str){
  // basic test: "does this look like JSON?"
  let regex = /^[ \r\n\t]*[{[]/

  return regex.test(str)

}

function makePadding(len) {
  let str = ""

  while(str.length < len) {
    str += " "
  }

  return str
}
