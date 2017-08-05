export function uniqueErrors(errors) {
  if(!Array.isArray(errors)) {
    return []
  }
  const seen = {}

  const filtered = errors.map(err => {
    const id = `${err.dataPath} ${err.message}`
    if(seen[id]) {
      // not unique
      seen[id]++
      return null
    }

    seen[id] = 1
    return err
  })

  console.log(seen)

  return filtered.filter(err => !!err) // cull any `null` entries
}
