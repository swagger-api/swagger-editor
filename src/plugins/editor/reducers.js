import {
  JUMP_TO_LINE
} from "./actions"

export default {
  [JUMP_TO_LINE]: (state, { payload } ) =>{
    return state.set("gotoLine", { line: payload })
  }
}
