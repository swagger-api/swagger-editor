import memoize from "lodash/debounce"

const isVendorExt = (str) => str.indexOf("x-") !== 0

export const allDefinitions = () => (system) => {
  return system.fn.traverse(system.specSelectors.spec().toJS()).reduce(function(acc) {
    acc.push({
      key: this.key,
      path: this.path,
      value: this.value,
    })
    return acc
  },[])
}

// const memAllSchemas = memoize((debTraverse, json) => {
//   return debTraverse(json, function(){
//     console.log(this.key)
//   })
// })

// TODO cover inline-schemas
export const allSchemas = () => (system) => {
  return system.fn.traverse(system.specSelectors.jsonAsJS()).reduce(function(acc) {
    if(this.key == "schema") {
      acc.push({
        key: this.key,
        path: this.path,
        parent: this.parent,
        node: this.node,
      })
    }
    return acc
  }, [])
}

export const allOperations = () => (system) => {
  return system.fn.traverse(system.specSelectors.jsonAsJS()).reduce(function(acc) {
    const isOperation = (
           this.path[0] == "paths"
        && this.path.length === 3
        && !isVendorExt(this.key)
    )

    if(isOperation) {
      acc.push(this)
    }
    window.node = this

    return acc
  },[])
}
