import TopbarPlugin from "./topbar"
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
    StandaloneLayoutPlugin
  ]
}
