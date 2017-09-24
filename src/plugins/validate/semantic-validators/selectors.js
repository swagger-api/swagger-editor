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
