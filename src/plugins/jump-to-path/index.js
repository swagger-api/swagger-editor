import spec from "./spec"
import JumpToPath from "./jump-to-path"

export default function JumpToPathPlugin() {
  return [
    spec,
    {
      components: {
        JumpToPath
      },
    }
  ]
}
