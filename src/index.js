import deepMerge from "deepmerge"
import SwaggerUI from "swagger-ui"
import EditorLayout from "./layout"
import "swagger-ui/dist/swagger-ui.css"

import EditorPlugin from "./plugins/editor"
import LocalStoragePlugin from "./plugins/local-storage"
import TopBarPlugin from "./plugins/topbar"
import ValidationApiPlugin from "./plugins/validation/apis"

const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION } = buildInfo

window.versions = window.versions || {}
window.versions.swaggerEditor = `${PACKAGE_VERSION}/${GIT_COMMIT || 'unknown'}${GIT_DIRTY ? '-dirty' : ''}`

const defaults = {
  dom_id: "#swagger-editor",
  layout: "EditorLayout",
  presets: [
    SwaggerUI.presets.apis
  ],
  plugins: [
    EditorPlugin,
    TopBarPlugin,
    ValidationApiPlugin,
    LocalStoragePlugin
  ],
  components: {
    EditorLayout,
  },
}

module.exports = function SwaggerEditor(options) {
  let mergedOptions = deepMerge(defaults, options)

  return SwaggerUI(mergedOptions)
}
