import expect, { createSpy } from "expect"
import rewiremock from "rewiremock"
import { shallow } from "enzyme"
import React from "react"
import FakeAce from "test/mocha/mocks/ace.js"
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

describe("editor", function () {
  before(function () {
    // Whole bunch of mocks!
    rewiremock.enable()
    rewiremock("brace/mode/yaml").with({})
    rewiremock("brace/theme/tomorrow_night_eighties").with({})
    rewiremock("brace/ext/language_tools").with({})
    rewiremock("brace/ext/searchbox").with({})
    rewiremock("./brace-snippets-yaml").with({})
    rewiremock("./editor.less").with({})
  })

  after(function () {
    rewiremock.disable()
  })

  beforeEach(function () {
    delete require.cache[require.resolve("react-ace")]
  })


  describe("editor component", function () {

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
      wrapper.setProps({ value: "new value", origin: "editor" })

      // Then
      await pause(EVENTUALLY)
      expect(fakeAce.userSees()).toEqual("original value")
    })

    // SKIPPED: Does this have any value at this level? And not editor-container?
    it.skip("SKIP: should EVENTUALLY call onChange ONCE if the user types/pauses/types", async function () {
      this.timeout(10000)

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})
      const spy = createSpy()
      const wrapper = shallow(
        <Editor value="original value" onChange={spy} />
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

    it("should EVENTUALLY call onChange when ctrl-z", async function () {
      this.timeout(10000)

      // Given
      const fakeAce = new FakeAce()
      rewiremock("brace").with(fakeAce)
      const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({})
      const spy = createSpy()
      const wrapper = shallow(
        <Editor value="original value" onChange={spy} />
      )
      wrapper.find("ReactAce").shallow()
      fakeAce.userTypes("one")

      // When
      fakeAce.userUndo()

      await pause(EVENTUALLY)
      expect(fakeAce.userSees()).toEqual("original value")
      expect(spy.calls.length).toEqual(1)
    })

    describe("markers", function () {

      it("should place markers into editor", async function () {
        // Given
        const fakeAce = new FakeAce()
        const spy = createSpy()
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({ placeMarkerDecorations: spy })
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const dummy = fromJS({ one: 1 })
        const wrapper = shallow(
          <Editor markers={dummy} />
        )

        // When
        wrapper.find("ReactAce").shallow()
        await pause(EVENTUALLY)

        // Then
        expect(spy.calls.length).toEqual(1)
        expect(spy.calls[0].arguments[0]).toInclude({ markers: { one: 1 } })
      })

      it("should place markers after yaml", async function () {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => order.push("placeMarkers"))
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({ placeMarkerDecorations: spy })
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


      it.skip("should Test for markers being disabled/enabled during a yaml update", async function () {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => {
          order.push("placeMarkers")
          return () => order.push("removeMarkers")
        })
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({ placeMarkerDecorations: spy })
        const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({})
        const wrapper = shallow(
          <Editor value="original value" markers={{}} />
        )
        wrapper.find("ReactAce").shallow()

        // When
        wrapper.setProps({ value: "new value", origin: "bob" })
        await pause(EVENTUALLY)

        // Then
        expect(order).toEqual(["setValue", "placeMarkers", "removeMarkers", "setValue", "placeMarkers"])
      })

      it.skip("should Test for markers being disabled/enabled during ctrl-z", async function () {
        // Given
        const order = []
        const fakeAce = new FakeAce()
        fakeAce.setValue.andCall(() => order.push("setValue"))
        const spy = createSpy().andCall(() => {
          order.push("placeMarkers")
          return () => order.push("removeMarkers")
        })
        rewiremock("brace").with(fakeAce)
        rewiremock("../editor-helpers/marker-placer").with({ placeMarkerDecorations: spy })
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
