import EventEmitter from "events"
import { createSpy } from "expect"

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

    this.selection = new EventEmitter()
    this.selection.toJSON = createSpy().andReturn({ fake: true })
    this.selection.fromJSON = createSpy().andReturn({ fake: true })
  }

  addMarker = createSpy().andCall((marker) => {
    this._markers.push({ ...marker, id: this.$markerId++ })
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
    this._undoStack = [""]
    this._undoPointer = 0 // It starts with nothing..

    ACE_STUBS.forEach(stub => {
      this[stub] = createSpy()
    })

    this.renderer = {
      setShowGutter: createSpy(),
      setScrollMargin: createSpy()
    }
  }

  edit = createSpy().andReturn(this)

  acequire = createSpy().andCall((module) => {
    if (module == "ace/range") {
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
    this.$options = { ...this.$options, ...options }
  })

  getOption = createSpy().andCall((optionName) => {
    return this.$options[optionName]
  })

  setValue = createSpy().andCall((val, addToUndo = true) => {
    if (addToUndo) {
      // Wipe out line of redos
      this._undoStack = this._undoStack.slice(0, this._undoPointer + 1)
      // Add new value
      this._undoStack.push(val)
      this._undoPointer++
    }
    this._value = val
    this.emit("change") // Remove
    this.emit("change") // Insert
  })

  getValue = createSpy().andCall(() => {
    return this._value || ""
  })

  // User API, which closer matches what we want to test ( ie: implementation can improve )
  userTypes = createSpy().andCall((val) => {
    this.setValue(this.getValue() + val)
  })

  userSees = createSpy().andCall(() => {
    return this.getValue()
  })

  userUndo = createSpy().andCall(() => {
    this._undoPointer = this._undoPointer > 0 ? this._undoPointer - 1 : 0
    this.setValue(this._undoStack[this._undoPointer], false)
  })

  userRedo = createSpy().andCall(() => {
    const max = this._undoStack.length - 1
    // const oriPointer = this._undoPointer
    this._undoPointer = this._undoPointer < max ? this._undoPointer + 1 : max
    this.setValue(this._undoStack[this._undoPointer], false)
  })

}
