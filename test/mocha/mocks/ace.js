import EventEmitter from "events"
import sinon from "sinon"

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
      this[stub] = sinon.stub()
    })

    this.selection = new EventEmitter()
    this.selection.toJSON = sinon.stub().returns({ fake: true })
    this.selection.fromJSON = sinon.stub().returns({ fake: true })
  }

  addMarker = sinon.stub().callsFake((marker) => {
    this._markers.push({ ...marker, id: this.$markerId++ })
  })

  getMarkers = sinon.stub().callsFake(() => {
    return this._markers
  })

  removeMarker = sinon.stub().callsFake((markerId) => {
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
      this[stub] = sinon.stub()
    })

    this.renderer = {
      setShowGutter: sinon.spy(),
      setScrollMargin: sinon.spy()
    }
  }

  edit = sinon.stub().returns(this)

  acequire = sinon.stub().callsFake((module) => {
    if (module == "ace/range") {
      return { Range }
    }
  })

  getSession = sinon.stub().callsFake(() => {
    return this.session
  })

  setOption = sinon.stub().callsFake((option, val) => {
    this.$options[option] = val
  })

  setOptions = sinon.stub().callsFake((options) => {
    this.$options = { ...this.$options, ...options }
  })

  getOption = sinon.stub().callsFake((optionName) => {
    return this.$options[optionName]
  })

  setValue = sinon.stub().callsFake((val, addToUndo = true) => {
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

  getValue = sinon.stub().callsFake(() =>{
    return this._value || ""
  })

  // User API, which closer matches what we want to test ( ie: implementation can improve )
  userTypes = sinon.stub().callsFake((val) => {
    this.setValue(this.getValue() + val)
  })

  userSees = sinon.stub().callsFake(() => {
    return this.getValue()
  })

  userUndo = sinon.stub().callsFake(() => {
    this._undoPointer = this._undoPointer > 0 ? this._undoPointer - 1 : 0
    this.setValue(this._undoStack[this._undoPointer], false)
  })

  userRedo = sinon.stub().callsFake(() => {
    const max = this._undoStack.length - 1
    // const oriPointer = this._undoPointer
    this._undoPointer = this._undoPointer < max ? this._undoPointer + 1 : max
    this.setValue(this._undoStack[this._undoPointer], false)
  })
}
