import expect from "expect"

describe("EditorLayout", function() {
  let EditorLayout

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

  // Create spies for alert and FileReader, and then load the module under test.
  before(function () {
    expect.spyOn(global, "alert")
    expect.spyOn(global, "FileReader")
    EditorLayout = require("src/layout").default
  })
  // Undo the spies afterwards
  after(function () {
    expect.restoreSpies()
  })

  // Reset spies after each test
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

        expect(global.alert.calls.length).toEqual(2)

        global.alert.calls.forEach(call => {
          expect(call.arguments[0]).toMatch(/^Sorry.*/)
        })
      })
    })

    describe("if more than one file of an expected type is dropped", function() {
      it("should alert the user that their file(s) were rejected", () => {
        const editorLayout = new EditorLayout()

        editorLayout.onDrop(["accepted.file.1", "accepted.file.2"], [])
        expect(global.alert.calls.length).toEqual(1)
        expect(global.alert.calls[0].arguments[0]).toMatch(/^Sorry.*/)
      })
    })

    describe("if exactly one file of an expected type is dropped", function() {
      it("should call the updateSpec function passed in as props with the contents of the file", () => {
        const fileContents = "This is my awesome file!"
        const props = {
          specActions: {
            updateSpec: expect.createSpy()
          }
        }
        global.FileReader.andReturn({
          readAsText: function () { this.onloadend() },
          result: fileContents
        })

        const editorLayout = new EditorLayout(props)

        editorLayout.onDrop(["accepted.file"])

        expect(props.specActions.updateSpec).toHaveBeenCalledWith(fileContents, "fileDrop")
      })
    })
  })

  describe("onChange", function() {
    it("should call specActions.updateSpec with origin = editor by default", function() {
      // Given
      const spy = expect.createSpy()
      const props ={
        specActions: {
          updateSpec: spy
        }
      }
      const editorLayout = new EditorLayout(props)

      // When
      editorLayout.onChange("one: 1")

      // Then
      expect(spy.calls.length).toEqual(1)
      expect(spy.calls[0].arguments).toEqual(["one: 1", "editor"])
    })

    it("should allow (onDrop) to override with different origin", function() {
      // Given
      const spy = expect.createSpy()
      const props ={
        specActions: {
          updateSpec: spy
        }
      }
      const editorLayout = new EditorLayout(props)

      // When
      editorLayout.onChange("one: 1", "somethingElse")

      // Then
      expect(spy.calls.length).toEqual(1)
      expect(spy.calls[0].arguments).toEqual(["one: 1", "somethingElse"])
    })
  })
})
