import EventEmitter from "events"
import { createSpy, spyOn } from "expect"

export class Range {
  constructor(...args) {
    this._args = args
  }
}

const ACE_STUBS = [
  "setKeyboardHandler",
  "focus",
  "resize",
  "destroy",
  "setTheme",
  "setFontSize",
  "setHighlightActiveLine",
  "setReadOnly",
  "setShowPrintMargin",
]


const SESSION_STUBS = [
  "setMode",
  "setUseWrapMode",
  "setAnnotations"
]

export class Session extends EventEmitter {
  constructor() {
    super()

    this.$markerId = 0
    this._markers = []

    SESSION_STUBS.forEach(stub => {
      this[stub] = createSpy()
    })

    this.selection = {
      toJSON: createSpy().andReturn({fake: true}),
      fromJSON: createSpy(),
    }

  }

  addMarker = createSpy().andCall((marker) => {
    this._markers.push({...marker, id: this.$markerId++ })
  })

  getMarkers = createSpy().andCall(() => {
    return this._markers
  })

  removeMarker = createSpy().andCall((markerId) => {
    this._markers = this._markers.filter(a => a.id !== markerId)
  })

}

export default class Ace extends EventEmitter {

  constructor() {
    super()

    this.session = new Session()
    this.$options = {}
    this.on("change", this.setValue)

    ACE_STUBS.forEach(stub => {
      this[stub] = createSpy()
    })

    this.renderer = {
      setShowGutter: createSpy()
    }
  }

  edit = createSpy().andReturn(this)

  acequire = createSpy().andCall((module) => {
    if(module == "ace/range") {
      return { Range }
    }
  })

  getSession = createSpy().andCall(() => {
    return this.session
  })

  setOption = createSpy().andCall((option, val) => {
   this.$options[option] = val
  })

  setOptions = createSpy().andCall((options) => {
    this.$options = {...this.$options, ...options}
  })

  getOption = createSpy().andCall((optionName) => {
    return this.$options[optionName]
  })

  setValue = createSpy().andCall((val) => {
    this._value = val
  })

  getValue = createSpy().andCall(() => {
    return this._value
  })

}
