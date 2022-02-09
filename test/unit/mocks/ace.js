import EventEmitter from 'events';

export class Range {
  constructor(...args) {
    this._args = args;
  }
}

const ACE_STUBS = [
  'setKeyboardHandler',
  'focus',
  'resize',
  'destroy',
  'setTheme',
  'setFontSize',
  'setHighlightActiveLine',
  'setReadOnly',
  'setShowPrintMargin',
];


const SESSION_STUBS = [
  'setMode',
  'setUseWrapMode',
  'setAnnotations'
];

export class Session extends EventEmitter {
  constructor() {
    super();

    this.$markerId = 0;
    this._markers = [];

    SESSION_STUBS.forEach(stub => {
      this[stub] = jest.fn();
    });

    this.selection = new EventEmitter();
    this.selection.toJSON = jest.fn().mockImplementation(function() {
      return { fake: true };
    });
    this.selection.fromJSON = jest.fn().mockImplementation(function() {
      return { fake: true };
    });
  }

  addMarker = jest.fn().mockImplementation(function(marker) {
    this._markers.push({...marker, id: this.$markerId++ });
  });

  getMarkers = jest.fn().mockImplementation(function() {
    return this._markers;
  });

  removeMarker = jest.fn().mockImplementation(function(markerId) {
    this._markers = this._markers.filter(a => a.id !== markerId);
  });

}

export default class Ace extends EventEmitter {

  constructor() {
    super();

    this.session = new Session();
    this.$options = {};
    this._undoStack = [''];
    this._undoPointer = 0; // It starts with nothing..

    ACE_STUBS.forEach(stub => {
      this[stub] = jest.fn();
    });

    this.renderer = {
      setShowGutter: jest.fn(),
      setScrollMargin: jest.fn()
    };
  }

  edit = jest.fn().mockImplementation(function() { return this;});

  acequire = jest.fn().mockImplementation(function(module) {
    if(module == 'ace/range') {
      return { Range };
    }
  });

  getSession = jest.fn().mockImplementation(function() {
    return this.session;
  });

  setOption = jest.fn().mockImplementation(function(option, val) {
   this.$options[option] = val;
  });

  setOptions = jest.fn().mockImplementation(function(options) {
    this.$options = {...this.$options, ...options};
  });

  getOption = jest.fn().mockImplementation(function(optionName) {
    return this.$options[optionName];
  });

  setValue = jest.fn().mockImplementation(function(val, addToUndo=true) {
    if(addToUndo) {
      // Wipe out line of redos
      this._undoStack = this._undoStack.slice(0, this._undoPointer + 1);
      // Add new value
      this._undoStack.push(val);
      this._undoPointer++;
    }
    this._value = val;
    this.emit('change'); // Remove
    this.emit('change'); // Insert
  });

  getValue = jest.fn().mockImplementation(function() {
    return this._value || '';
  });

  // User API, which closer matches what we want to test ( ie: implementation can improve )
  userTypes = jest.fn().mockImplementation(function(val) {
    this.setValue(this.getValue() + val);
  });

  userSees = jest.fn().mockImplementation(function() {
    return this.getValue();
  });

  userUndo = jest.fn().mockImplementation(function() {
    this._undoPointer = this._undoPointer > 0 ? this._undoPointer - 1 : 0;
    this.setValue(this._undoStack[this._undoPointer], false);
  });

  userRedo = jest.fn().mockImplementation(function() {
    const max = this._undoStack.length - 1;
    // const oriPointer = this._undoPointer
    this._undoPointer = this._undoPointer < max ? this._undoPointer + 1 : max;
    this.setValue(this._undoStack[this._undoPointer], false);
  });

}
