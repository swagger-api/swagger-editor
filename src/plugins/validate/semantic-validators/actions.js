import forEach from "lodash/forEach"
import {fromJS} from "immutable"
import isUndefined from "lodash/isUndefined"

const mark = !isUndefined(performance) ? performance.now.bind(performance) : Date.now.bind(Date)
const time = (name, fn) => {
  const a = mark()
  const r = fn()
  const b = mark()
  console.log(name,"took", b - a, "ms") // eslint-disable-line no-console
  return r
}
const Timer = function(name) {
  this._name = name
  this._markers = []
  this.start()
}
Timer.prototype.start = function() {
  this._start = mark()
}
Timer.prototype.mark = function(name) {
  this._markers = this._markers || []
  this._markers.push({
    time: mark(),
    name
  })
}
Timer.prototype.end = function(name) {
  this.mark(name)
  this._markers.forEach(m => {
    console.log(this._name, m.name, m.time - this._start, "ms")
  })
  this._markers = []
  this.start()
}


export const all = () => (system) => {

  // don't run validation if spec is empty
  if(system.specSelectors.specStr().trim().length === 0) {
    return
  }

  system.errActions.clear({
    source: "Validation"
  })

  const cb = (obj) => setTimeout(() => {
    obj.line = obj.line || system.fn.AST.getLineNumberForPath(system.specSelectors.specStr(), obj.path)
    obj.source = "Validation"
    system.errActions.newSpecErr(obj)
  }, 0)

  time("All validations", () => {
    forEach(system.validateActions, (fn, name) => {
      if(name.indexOf("validate") === 0) {
        time("Validate "+name+":", () => fn(cb))
      }
    })
  })
}

export const validateFoos = (cb) => (system) => {
  system.validateSelectors.allDefinitions().forEach(function(node) {
    if(node.key === "foo") {
      cb({
        message: "Found a foo!",
        path: node.path,
        level: "error",
      })
    }
  })
}


export const validate$Refs = (cb) => (system) => {
  const specStr = system.specSelectors.specStr()
  const refRegex = /\$ref.*["'](.*)["']/g
  let match = refRegex.exec(specStr)
  let refs = new Set()

  while(match !== null) {
    refs.add(match[1])
    match = refRegex.exec(specStr)
  }

  system.specSelectors.definitions()
    .forEach((val, key) => {
      if(!refs.has(`#/definitions/${key}`)) {
        const path = ["definitions", key]
        cb({
          level: "error",
          path,
          message: "Definition was declared but never used in document"
        })
      }
  })
}
