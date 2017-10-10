import spec from "./spec"
import * as components from "./components"

export default function JumpToPathPlugin() {
  return [
    spec,
    {
      components,
    }
  ]
}
