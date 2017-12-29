## Semantic Validators
Ie: anything not covered by the json-schema validation

All the following belongs to the `validate` namespace
Eg: a plugin with an action ( to validate things ) and a selector, to get nodes and stuff.
```js
export function SomeAwesomePlugin() {
  return {
    statePlugins: {
      validate: { // "validate" Namespace
        actions: {
          validateSomeNewValidateFunction() {}
        },
        selectors: {
          someNewSelector() {}
        }
      } 
    }
  } 
}
```

### Make a new one
```js

// Under the validate namespace
export const validateOnlyFoos = () => (system) => {
  system.validateSelectors.allSchemas().then(schemas => {
    const errors = []
    schemas.forEach( schema => {
      if(schema.node.type === "array") { // `node` is the value at that point
        errors.push({
          level: "error",
          message: "We can do something with this, array.",
          path: schema.path // it'll figure out the line # from this
        })
      }
    })
  }))
}
```
  
### Make a selector, to later validate
We use a single traverser although its performance leaves a little to be desired.
The idea is that you provide a name and a filter function and
in turn your validators can then iterate over those "nodes" to validate them.

```js
export const allParameters = () => (system) => {
  return system.fn.traverseOnce({ // Returns a promise
    name: "allParameterSchemas",
    fn: (node) => { // called for each node, you need to return the node if you want it in the collecction
      if(system.validateSelectors.isParameter(node)) {
        return true
      }
    },
  })
}
```
