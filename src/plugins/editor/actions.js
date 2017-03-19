export const JUMP_TO_LINE = "jump_to_line"

export function jumpToLine(line) {
  return {
    type: JUMP_TO_LINE,
    payload: line
  }
}
