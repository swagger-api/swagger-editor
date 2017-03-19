# Semantic Validator plugins

Semantic validator plugins offer an interface for implementing custom validation functionality.

### What to export

Each plugin should export an object with a `validate` function available.

### Inputs

Each plugin receives two _toolbox_ objects for making the necessary decisions on whether a spec contains errors:

##### Spec toolbox
- `jsonSpec`: the spec as a JavaScript object
- `jsonAST`: the spec's AST as a JavaScript object
- `yamlString`: the spec as a YAML string (this is usually what's in the editor)

##### Helper function toolbox
- `getLineNumberForPath`

### Outputs

Each plugin's `validate` function _must_ either return an object formatted as such:

Return:
```
{
  errors: Array<Error> ||,
  warnings: Array<Warning>
}
```

..`Error`s and `Warnings` look like this:
```
{
  line: Number,
  message: String
}
```

### An example

```
export function validate({ jsSpec }) {
  let errors = []
  let warnings = []

  errors.push({
    line: 5,
    message: 'test error'
  })

  errors.push({
    line: 6,
    message: 'test error'
  })

  warnings.push({
    line: 7,
    message: 'test warning'
  })

  return { errors, warnings }
}

```

### Measuring performance

To see the time taken by each semantic validator, drop `window.LOG_SEMVAL_PERF = true` into your console, then trigger a validation.
