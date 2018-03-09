const HARD_CYCLE_LIMIT = 200

export function getRootNode(node) {
  var i = 0
  while(node.notRoot && i < HARD_CYCLE_LIMIT) {
    node = node.parent
    i++
  }
  return node || {}
}
