A guide to custom patterns used in the JSON Schema validation documents in this folder...

### Pivot key existential switch

Applies a schema to an object based on whether a key exists in an object.

> "If key A exists on the object, apply schema X. Else, apply schema Y."

```yaml
switch:
- if:
    required: [a]
  then:
    description: schema X; within `then` can be any JSON Schema content
- then:
    description: schema Y; within `then` can be any JSON Schema content
```

### Pivot key value switch

Applies a schema to an object based on the value of a specific, always-required key (the "pivot key").

> "If key A is foo, apply schema X. Else, if key A is bar, apply schema Y. Else, tell the user that key A must be foo or bar."

- The pivot key must be `required` in each `if` block, otherwise the switch may generate a false positive for the entire object when the key isn't provided at all.
- The default case (the last one, with `then` but no `if`) must always require the pivot key's presence and report all possible values back as an enum, otherwise a misleading error message may be shown to the user.

```yaml
switch:
- if:
    required: [a]
    properties: { a: { enum: [foo] } }
  then:
    description: schema X; within `then` can be any JSON Schema content
- if:
    required: [a]
    properties: { a: { enum: [bar] } }
  then:
    description: schema Y; within `then` can be any JSON Schema content
- then:
    description: fallback schema; ensures the user is told the pivot key is needed and should have one of the enumerated values
    required: [a]
    properties: { a: { enum: [foo, bar] } }
```