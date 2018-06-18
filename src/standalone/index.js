import TopbarPlugin from "./topbar"
import TopbarInsertPlugin from "./topbar-insert"
import StandaloneLayout from "./standalone-layout"

let StandaloneLayoutPlugin = function() {
  return {
    components: {
      StandaloneLayout
    }
  }
}

module.exports = function () {
  return [
    TopbarPlugin,
    TopbarInsertPlugin,
    StandaloneLayoutPlugin
  ]
}
