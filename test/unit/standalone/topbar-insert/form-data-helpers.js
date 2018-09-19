import { fromJS } from "immutable"
import React from "react"
import expect from "expect"
import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-15"
import { getForm } from "src/standalone/topbar-insert/forms/helpers/form-data-helpers"

configure({ adapter: new Adapter() })

describe("editor topbar insert form UI generation", function() {
  this.timeout(10 * 1000)

  it("should produce a valid form UI for a simple form object", () => { 
    const form = fromJS({
      fielda: {
        value: "test value",
        isRequired: true,
        name: "field a"
      }
    })

    const element = <div> {getForm(form)} </div>
    const wrapper = mount(element)

    expect(wrapper.find("input").length).toEqual(1)
  })

  it("should produce a form ui with a dropdown for a form object specifying options", () => {
    const form = fromJS({
      fielda: {
        value: "",
        isRequired: true,
        name: "field a",
        options: ["optiona", "optionb"]
      }
    })

    const element = <div> {getForm(form)} </div>
    const wrapper = mount(element)

    expect(wrapper.find("select").length).toEqual(1)
  })
})