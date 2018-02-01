import * as sinon from "sinon"

describe("EditorLayout", function() {
  let EditorLayout
  const sandbox = sinon.createSandbox()
  
  // If alert isn't defined, create a dummy one, and remember to clean it up afterwards
  if (typeof global.alert === "undefined") {
    before(function () {
      global.alert = function() { }
    })
    after(function () {
      delete global.alert
    })
  }

  // Same for FileReader
  if (typeof global.FileReader === "undefined") {
    before(function () {
      global.FileReader = function() {}
    })
    after(function () {
      delete global.FileReader
    })
  }

  // Create sinon stubs for alert and FileReader, and then load the module under test.
  before(function () {
    sandbox.stub(global, "alert")
    sandbox.stub(global, "FileReader")
    EditorLayout = require("src/layout").default
  })
  after(function () {
    sandbox.restore()
  })

  afterEach(function () {
    global.alert.reset()
    global.FileReader.reset()
  })

  describe("when file(s) are dropped", function() {
    describe("if one or more files are of an unexpected type", function() {
      it("should alert the user that their file(s) were rejected", () => {
        const editorLayout = new EditorLayout()

        editorLayout.onDrop([], ["rejected.file.1"])
        editorLayout.onDrop([], ["rejected.file.1", "rejected.file.2"])

        sinon.assert.calledTwice(global.alert)
        sinon.assert.alwaysCalledWithMatch(global.alert, sinon.match(/^Sorry.*/))
      })
    })

    describe("if more than one file of an expected type is dropped", function() {
      it("should alert the user that their file(s) were rejected", () => {
        const editorLayout = new EditorLayout()

        editorLayout.onDrop(["accepted.file.1", "accepted.file.2"], [])

        sinon.assert.calledWithMatch(global.alert, sinon.match(/^Sorry.*/))
      })
    })

    describe("if exactly one file of an expected type is dropped", function() {
      it("should call the updateSpec method on the specActions prop with the contents of the file", () => {
        const fileContents = "This is my awesome file!"
        const props = {
          specActions: {
            updateSpec: sinon.stub()
          }
        }
        global.FileReader.returns({ 
          readAsText: function () { this.onloadend() }, 
          result: fileContents 
        })

        const editorLayout = new EditorLayout(props)

        editorLayout.onDrop(["accepted.file"])

        sinon.assert.calledWith(props.specActions.updateSpec, fileContents)
      })
    })
  })
})
