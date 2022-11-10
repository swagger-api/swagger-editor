import TopbarPlugin from "./topbar"
import TopbarInsertPlugin from "./topbar-insert"
import TopbarMenuFileImportFile from "./topbar-menu-file-import_file"
import TopbarMenuEditConvert from "./topbar-menu-edit-convert"
import TopbarNewEditorButton from "./topbar-new-editor-button"
import StandaloneLayout from "./standalone-layout"

let StandaloneLayoutPlugin = function() {
  return {
    components: {
      StandaloneLayout
    }
  }
}

function standalonePreset () {
  return [
    TopbarPlugin,
    TopbarInsertPlugin,
    TopbarMenuFileImportFile,
    TopbarMenuEditConvert,
    StandaloneLayoutPlugin
  ]
}

standalonePreset.plugins = {
  TopbarPlugin,
  TopbarInsertPlugin,
  TopbarMenuFileImportFile,
  TopbarMenuEditConvert,
  TopbarNewEditorButton,
  StandaloneLayoutPlugin,
}

export default standalonePreset
