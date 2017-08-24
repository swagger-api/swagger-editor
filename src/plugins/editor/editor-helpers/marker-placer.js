// This code is registered as a helper, not a plugin, because its lifecycle is
// unique to the needs of the marker placement logic.

import countBy from "lodash/countBy"
import map from "lodash/map"

let removers = []

function setRemovers(arr) {
  removers.forEach(fn => fn()) // remove existing anchors & gutters
  removers = arr // use parent scope to persist reference
}

export function placeMarkerDecorations({editor, markers, onMarkerLineUpdate}) {

  if(typeof editor !== "object") {
    return
  }

  let markerLines = countBy(Object.values(markers), "position")

  let removeFns = map(markerLines, (count, line) => {
    let className = `editor-marker-${count > 8 ? "9-plus" : count}`
    let s = editor.getSession()
    let anchor = s.getDocument().createAnchor(+line, 0)

    anchor.setPosition(+line, 0) // noClip = true
    s.addGutterDecoration(+line, className)
    anchor.on("change", function (e) {
      var oldLine = e.old.row
      var newLine = e.value.row

      s.removeGutterDecoration(oldLine, className)
      s.addGutterDecoration(newLine, className)
      onMarkerLineUpdate([oldLine, newLine, line])
    })

    return function () {
      // // Remove the anchor & decoration
      let currentLine = +anchor.getPosition().row
      editor.getSession().removeGutterDecoration(currentLine, className)
      anchor.detach()
    }
  })

  setRemovers(removeFns)

  // To manually remove them
  return () => setRemovers([])

}
