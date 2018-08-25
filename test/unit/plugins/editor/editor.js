import expect, { createSpy } from "expect"
import rewiremock from "rewiremock"
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-15"
import React from "react"
import FakeAce, { Session } from "test/unit/mocks/ace.js"
import { fromJS } from "immutable"

const pause = (ms) => new Promise((res) => setTimeout(res, ms))

const EVENTUALLY = 900 // ms

/**
* We're mocking out the editor,
* so uses of the phrase "should see this in editor",
* will match to the following Ace methods:
*
* - "what user see's in editor" => fakeAce.userSees()
* - "user types something (end of document)" => fakeAce.userTypes("hi")
* - "Ctrl-Z" => fakeAce.userUndo()
* - "Ctrl-Shift-Z" => fakeAce.userRedo()
**/

describe("editor", function() {
  before(function () {
    // Enzyme.configure({ adapter: new Adapter()})
    Enzyme.configure({ adapter: new Adapter()})

    // Whole bunch of mocks!
    rewiremock.enable()
    rewiremock("brace/mode/yaml").with({})
    rewiremock("brace/theme/tomorrow_night_eighties").with({})
    rewiremock("brace/ext/language_tools").with({})
    rewiremock("brace/ext/searchbox").with({})
    rewiremock("./brace-snippets-yaml").with({})
    rewiremock("./editor.less").with({})
  })

  after(function() {
    rewiremock.disable()
  })

  beforeEach(function() {
    delete require.cache[require.resolve("react-ace")]
  })

  describe("fake ace", function() {

    it("should be an event emitter", () => {
      // Given
      const fakeAce = new FakeAce()
      const spy = createSpy()
      fakeAce.on("foo", spy)

      // When
      fakeAce.emit("foo", "bar")

      // Then
      expect(spy.calls.length).toEqual(1)
      expect(spy.calls[0].arguments[0]).toEqual("bar")
    })

    it("should return `this`, when calling .edit", function() {
      // Given
      const fakeAce = new FakeAce()

      // When
      const res = fakeAce.edit()

      // Then
      expect(res).toBe(fakeAce)
    })


    it("should keep track of setValue", function() {
      // Given
      const fakeAce = new FakeAce()

      // When
      fakeAce.setValue("foo")

      // Then
      const res = fakeAce.getValue()
      expect(res).toEqual("foo")
    })

    it("should spy on setValue", function() {
      // Given
      const fakeAce = new FakeAce()

      // When
      fakeAce.setValue("foo")

      // Then
      expect(fakeAce.setValue.calls.length).toEqual(1)
      expect(fakeAce.setValue.calls[0].arguments[0]).toEqual("foo")
    })

    it("should return a single session, with getSession", function() {
      // Given
      const fakeAce = new FakeAce()

      // When
      const res = fakeAce.getSession()

      // Then
      expect(res).toBeA(Session)
    })

    it("should add options via setOptions", function() {
      // Given
      const fakeAce = new FakeAce()

      // When
      fakeAce.setOptions({one: "uno"})

      // Then
      const res = fakeAce.getOption("one")
      expect(res).toEqual("uno")
    })

    describe("userUndo/Redo", function() {

      it("should revert to last input", function() {
        // Given
        const fakeAce = new FakeAce()
        fakeAce.userTypes("one")

        // When
        fakeAce.userTypes("two")

        // Then
        fakeAce.userUndo()
        expect(fakeAce.userSees()).toEqual("one")
      })

      it("should revert to empty document, no changes were made", function() {
        // Given
        const fakeAce = new FakeAce()

        // When
        fakeAce.userUndo()

        // Then
        expect(fakeAce.userSees()).toEqual("")
      })

      it("should revert to empty document, after arbitrary undos", function() {
        // Given
        const fakeAce = new FakeAce()

        // When
        fakeAce.userUndo()
        fakeAce.userUndo()
        fakeAce.userUndo()
        fakeAce.userUndo()

        // Then
        expect(fakeAce.userSees()).toEqual("")
      })

      it("should not extend redos after last change", function() {
        // Given
        const fakeAce = new FakeAce()
        fakeAce.userTypes("x")

        // When
        fakeAce.userRedo()
        fakeAce.userRedo()
        fakeAce.userRedo()

        // Then
        expect(fakeAce.userSees()).toEqual("x")
      })

      it("should allow redo after single undo", function() {
        // Given
        const fakeAce = new FakeAce()
        fakeAce.userTypes("x")
        fakeAce.userTypes("x")
        fakeAce.userUndo()

        // When
        fakeAce.userRedo()

        // Then
        expect(fakeAce.userSees()).toEqual("xx")
      })

      it("should create new thread of undo stack, after new change", function() {
        // Given
        const fakeAce = new FakeAce()
        fakeAce.userTypes("1")
        fakeAce.userTypes("2")
        fakeAce.userTypes("3")
        fakeAce.userTypes("4")
        fakeAce.userUndo() // 123
        fakeAce.userUndo() // 12
        fakeAce.userTypes("5") // 125

        // When
        fakeAce.userRedo() // 125, don't extend beyond

        // Then
        expect(fakeAce.userSees()).toEqual("125")
      })

    })

    describe("fake session", function() {

      it("should keep add state for markers", function() {
        // Given
        const fakeAce = new FakeAce()
        const fakeSession = fakeAce.getSession()

        // When
        fakeSession.addMarker({one: 1})

        // Then
        const res = fakeSession.getMarkers()
        expect(res).toBeAn("array")
        expect(res.length).toEqual(1)
        expect(res[0]).toEqual({id: 0, one: 1})
      })

      it("should keep remove state for markers", function() {
        // Given
        const fakeAce = new FakeAce()
        const fakeSession = fakeAce.getSession()
        fakeSession.addMarker({one: 1})

        // When
        fakeSession.removeMarker(0)

        // Then
        const res = fakeSession.getMarkers()
        expect(res).toBeAn("array")
        expect(res.length).toEqual(0)
      })

      it("should spy on addMarker", function() {
        // Given
        const fakeAce = new FakeAce()
        const fakeSession = fakeAce.getSession()

        // When
        fakeSession.addMarker({one: 1})

        // Then
        expect(fakeSession.addMarker.calls.length).toEqual(1)
      })

      it("should spy on setMode", function() {
        // Given
        const fakeAce = new FakeAce()
        const fakeSession = fakeAce.getSession()

        // When
        fakeSession.setMode()

        // Then
        expect(fakeSession.setMode.calls.length).toEqual(1)
      })

      it("should have a .selection which includes toJSON, fromJSON", function() {
        // Given
        const fakeAce = new FakeAce()

        // When
        const fakeSession = fakeAce.getSession()

        // Then
        expect(fakeSession.selection).toIncludeKey("toJSON")
        expect(fakeSession.selection).toIncludeKey("fromJSON")
      })


      describe("userTypes", function() {
        it("should emit 'change'", function() {
          // Given
          const fakeAce = new FakeAce()
          const spy = createSpy()
          fakeAce.on("change", spy)

          // When
          fakeAce.userTypes("hello")

          // Then
          expect(spy.calls.length).toBeGreaterThan(1)
        })

        it("should change the value", function() {
          // Given
          const fakeAce = new FakeAce()

          // When
          fakeAce.userTypes("hello")

          // Then
          expect(fakeAce.getValue()).toEqual("hello")
        })
      })

      describe("userSees", function() {
        it("should match userTypes", function() {
          // Given
          const fakeAce = new FakeAce()

          // When
          fakeAce.userTypes("hi")

          // Then
          const res = fakeAce.userSees()
          expect(res).toEqual("hi")
        })

        it("should match setValue", function() {
          // Given
          const fakeAce = new FakeAce()

          // When
          fakeAce.setValue("hello")

          // Then
          const res = fakeAce.userSees()
          expect(res).toEqual("hello")
        })
      })

    })

    describe("renderer", function() {
      it("should have a stub for setShowGutter", function() {
        // Given
        const fakeAce = new FakeAce()

        // When
        fakeAce.renderer.setShowGutter("foo")

        // Then
        expect(fakeAce.renderer.setShowGutter.calls.length).toEqual(1)
        expect(fakeAce.renderer.setShowGutter.calls[0].arguments[0]).toEqual("foo")
      })

    })

  })

  describe("editor component", function() {

    it("should EVENTUALLY call onChange when user enters input", (done) => {

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})
      const spy = createSpy()
      const wrapper = shallow(
        <Editor onChange={spy} />
      )
      wrapper
        .find("ReactAce").shallow()

      // When
      // Simulate user input
      fakeAce.userTypes("hello")

      // Then
      setTimeout(() => {
        expect(spy.calls.length).toEqual(1)
        expect(spy.calls[0].arguments[0]).toEqual("hello")
        done()
      }, EVENTUALLY)

    })

    it("should EVENTUALLY put the contents of `value` prop into editor, without regard to `origin` property", (done) => {

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})

      // When
      const wrapper = shallow(
        <Editor value={"original value"} />
      )
      wrapper.find("ReactAce").shallow()

      // Then
      setTimeout(() => {
        expect(fakeAce.userSees()).toEqual("original value")
        done()
      }, EVENTUALLY)
    })

    it("should EVENTUALLY put the contents of `value` prop into editor, with `foo` origin property ", (done) => {

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})

      // When
      const wrapper = shallow(
        <Editor value={"original value"} origin="foo" />
      )
      wrapper.find("ReactAce").shallow()

      // Then
      setTimeout(() => {
        expect(fakeAce.userSees()).toEqual("original value")
        done()
      }, EVENTUALLY)
    })

    it("should NEVER update ace if the yaml originated in editor", async () => {

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})

      // When
      const wrapper = shallow(
        <Editor value="original value" />
      )
      wrapper.find("ReactAce").shallow()
      wrapper.setProps({value: "new value", origin: "editor"})

      // Then
      await pause(EVENTUALLY)
      expect(fakeAce.userSees()).toEqual("original value")
    })

    // SKIPPED: Does this have any value at this level? And not editor-container?
    it.skip("SKIP: should EVENTUALLY call onChange ONCE if the user types/pauses/types", async function() {
      this.timeout(10000)

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})
      const spy = createSpy()
      const wrapper = shallow(
        <Editor value="original value" onChange={spy}/>
      )
      wrapper.find("ReactAce").shallow()

      // When
      fakeAce.userTypes(" one")
      await pause(EVENTUALLY / 2)
      fakeAce.userTypes("two")
      await pause(EVENTUALLY / 2)
      fakeAce.userTypes("three")
      await pause(EVENTUALLY / 2)

      await pause(EVENTUALLY * 2)
      expect(fakeAce.userSees()).toEqual("original value onetwothree")
      expect(spy.calls.length).toEqual(1)
    })

    it("should EVENTUALLY call onChange when ctrl-z", async function() {
      this.timeout(10000)

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})
      const spy = createSpy()
      const wrapper = shallow(
        <Editor value="original value" onChange={spy}/>
      )
      wrapper.find("ReactAce").shallow()
      fakeAce.userTypes("one")

      // When
      fakeAce.userUndo()

      await pause(EVENTUALLY)
      expect(fakeAce.userSees()).toEqual("original value")
      expect(spy.calls.length).toEqual(1)
    })

    describe("markers", function() {

      it("should place markers into editor", async function() {
        // Given
        const fakeAce = new FakeAce()
        const spy = createSpy()
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({placeMarkerDecorations: spy})
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const dummy = fromJS({one: 1})
        const wrapper = shallow(
          <Editor markers={dummy} />
        )

        // When
        wrapper.find("ReactAce").shallow()
        await pause(EVENTUALLY)

        // Then
        expect(spy.calls.length).toEqual(1)
        expect(spy.calls[0].arguments[0]).toInclude({markers: {one: 1}})
      })

      it("should place markers after yaml", async function() {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => order.push("placeMarkers"))
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({placeMarkerDecorations: spy})
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const wrapper = shallow(
          <Editor value="original value" markers={{}} />
        )

        // When
        wrapper.find("ReactAce").shallow()
        await pause(EVENTUALLY)

        // Then
        expect(order).toEqual(["setValue", "placeMarkers"])
      })


      it.skip("should Test for markers being disabled/enabled during a yaml update", async function() {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => {
          order.push("placeMarkers")
          return () => order.push("removeMarkers")
        })
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({placeMarkerDecorations: spy})
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const wrapper = shallow(
          <Editor value="original value" markers={{}} />
        )
        wrapper.find("ReactAce").shallow()

        // When
        wrapper.setProps({value: "new value", origin: "bob"})
        await pause(EVENTUALLY)

        // Then
        expect(order).toEqual(["setValue", "placeMarkers", "removeMarkers", "setValue", "placeMarkers"])
      })

      it.skip("should Test for markers being disabled/enabled during ctrl-z", async function() {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => {
          order.push("placeMarkers")
          return () => order.push("removeMarkers")
        })
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({placeMarkerDecorations: spy})
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const wrapper = shallow(
          <Editor value="original value" markers={{}} />
        )
        wrapper.find("ReactAce").shallow()

        // When
        fakeAce.userUndo()
        await pause(EVENTUALLY)

        // Then
        expect(order).toEqual(["setValue", "placeMarkers", "removeMarkers", "setValue", "placeMarkers"])
      })

    })
  })

})
