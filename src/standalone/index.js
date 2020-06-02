import TopbarPlugin from "./topbar"
import TopbarInsertPlugin from "./topbar-insert"
import TopbarMenuFileImportFile from "./topbar-menu-file-import_file"
import TopbarMenuEditConvert from "./topbar-menu-edit-convert"
import StandaloneLayout from "./standalone-layout"

let StandaloneLayoutPlugin = function() {
  return {
    components: {
      StandaloneLayout
    }
  }
}

export default function () {
  return [
    TopbarPlugin,
    TopbarInsertPlugin,
    TopbarMenuFileImportFile,
    TopbarMenuEditConvert,
    StandaloneLayoutPlugin
  ]
}
