
# css-parse

  JavaScript CSS parser for nodejs and the browser.

## Example

css:

```css
body {
  background: #eee;
  color: #888;
}
```

parse tree:

```json
{
  "type": "stylesheet",
  "stylesheet": {
    "rules": [
      {
        "type": "rule",
        "selectors": [
          "body"
        ],
        "declarations": [
          {
            "type": "declaration",
            "property": "background",
            "value": "#eee"
          },
          {
            "type": "declaration",
            "property": "color",
            "value": "#888"
          }
        ]
      }
    ]
  }
}
```

parse tree with `.position` enabled:

```json
{
  "type": "stylesheet",
  "stylesheet": {
    "rules": [
      {
        "type": "rule",
        "selectors": [
          "body"
        ],
        "declarations": [
          {
            "type": "declaration",
            "property": "background",
            "value": "#eee",
            "position": {
              "start": {
                "line": 3,
                "column": 3
              },
              "end": {
                "line": 3,
                "column": 19
              }
            }
          },
          {
            "type": "declaration",
            "property": "color",
            "value": "#888",
            "position": {
              "start": {
                "line": 4,
                "column": 3
              },
              "end": {
                "line": 4,
                "column": 14
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 2,
            "column": 1
          },
          "end": {
            "line": 5,
            "column": 2
          }
        }
      }
    ]
  }
}
```

If you also pass in `source: 'path/to/original.css'`, that will be set
on `node.position.source`.

## Performance

  Parsed 15,000 lines of CSS (2mb) in 40ms on my macbook air.

## License

  MIT
