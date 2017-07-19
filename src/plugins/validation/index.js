import { transformPathToArray } from "./path-translator"


// Core validation plugin
// Does nothing for now

export default function() {
  return {
    fn: {
      transformPathToArray
    }
  }
}
