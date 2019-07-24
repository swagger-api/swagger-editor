// Error condenser!
//
// 1. group all errors by path
// 2. score them by message frequency
// 3. select the most frequent messages (ties retain all equally-frequent messages)
// 4. concatenate the params of each occurrence of the most frequent message
// 5. create one condensed error for the path
// 6. return all condensed errors as an array

export function condenseErrors(errors) {
  if (!Array.isArray(errors)) {
    return []
  }

  const tree = {}

  function countFor(dataPath, message) {
    return tree[dataPath][message].length
  }

  errors.forEach(err => {
    const { dataPath, message } = err

    if (tree[dataPath] && tree[dataPath][message]) {
      tree[dataPath][message].push(err)
    } else if (tree[dataPath]) {
      tree[dataPath][message] = [err]
    } else {
      tree[dataPath] = {
        [message]: [err]
      }
    }
  })

  const dataPaths = Object.keys(tree)

  return dataPaths.reduce((res, path) => {
    const messages = Object.keys(tree[path])

    const mostFrequentMessageNames = messages.reduce(
      (obj, msg) => {
        const count = countFor(path, msg)

        if (count > obj.max) {
          return {
            messages: [msg],
            max: count
          }
        } else if (count === obj.max) {
          obj.messages.push(msg)
          return obj
        } else {
          return obj
        }
      },
      { max: 0, messages: [] }
    ).messages

    const mostFrequentMessages = mostFrequentMessageNames.map(
      name => tree[path][name]
    )

    const condensedErrors = mostFrequentMessages.map(messages => {
      return messages.reduce((prev, err) => {
        const obj = Object.assign({}, prev, {
          params: mergeParams(prev.params, err.params)
        })

        if (!prev.params && !err.params) {
          delete obj.params
        }
        return obj
      })
    })

    return res.concat(condensedErrors)
  }, [])
}

// Helpers

function mergeParams(objA = {}, objB = {}) {
  if (!objA && !objB) {
    return undefined
  }

  const res = {}

  for (let k in objA) {
    if (Object.prototype.hasOwnProperty.call(objA, k)) {
      res[k] = arrayify(objA[k])
    }
  }

  for (let k in objB) {
    if (Object.prototype.hasOwnProperty.call(objB, k)) {
      if (res[k]) {
        const curr = res[k]
        res[k] = curr.concat(arrayify(objB[k]))
      } else {
        res[k] = arrayify(objB[k])
      }
    }
  }

  return res
}

function arrayify(thing) {
  if (thing === undefined || thing === null) {
    return thing
  }
  if (Array.isArray(thing)) {
    return thing
  } else {
    return [thing]
  }
}
