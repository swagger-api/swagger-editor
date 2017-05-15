export const JUMP_TO_LINE = "jump_to_line"

export function jumpToLine(line) {
  return {
    type: JUMP_TO_LINE,
    payload: line
  }

}

// This is a hook. Will have editor instance
// It needs to be an async-function, to avoid dispatching an object to the reducer
export const onLoad = () => () => {}
