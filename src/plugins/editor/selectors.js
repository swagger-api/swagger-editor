import { createSelector } from "reselect"
import Im from "immutable"

const state = state => {
  return state || Im.Map()
}

export const gotoLine = createSelector(
  state,
  state => {
    return state.get("gotoLine") || null
  }
)
