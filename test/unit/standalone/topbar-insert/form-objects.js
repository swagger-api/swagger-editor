import expect from "expect"
import React from "react"
import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-15"
import { fromJS, List } from "immutable"

import { getForm } from "src/standalone/topbar-insert/forms/helpers/form-data-helpers"
import { pathForm, pathObject } from "src/standalone/topbar-insert/forms/FormObjects/pathObject"
import { operationForm, operationObject } from "src/standalone/topbar-insert/forms/FormObjects/operationObject"
import { infoObject } from "src/standalone/topbar-insert/forms/FormObjects/infoObject"
import { licenseForm} from "src/standalone/topbar-insert/forms/FormObjects/licenseObject"
import { contactForm } from "src/standalone/topbar-insert/forms/FormObjects/contactObject"
import { tagsForm, tagsObject } from "src/standalone/topbar-insert/forms/FormObjects/tagsObject"
import { tagForm } from "src/standalone/topbar-insert/forms/FormObjects/tagObject"
import { serversForm, serversObject } from "src/standalone/topbar-insert/forms/FormObjects/serversObject"
import { serverVariableForm } from "src/standalone/topbar-insert/forms/FormObjects/serverVariableObject"
import { externalDocumentationForm } from "src/standalone/topbar-insert/forms/FormObjects/externalDocumentationObject"
import { addOperationTagsForm, addOperationTagsObject } from "src/standalone/topbar-insert/forms/FormObjects/AddOperationTags"
import { selectOperationForm } from "src/standalone/topbar-insert/forms/FormObjects/SelectOperation"

configure({ adapter: new Adapter() })

let form

const updateFormCallback = (newForm, path) => {    
  form = form.setIn(path, newForm) 
}

describe("editor topbar insert forms", function() {
  this.timeout(10 * 1000)

  describe("operation object", function () {
    form = operationForm(updateFormCallback, [])
  
    const tag = form.getIn(["tags", "defaultItem"])(updateFormCallback, [])

    form = form
      .setIn(["path", "value"], "/testpath")
      .setIn(["summary", "value"], "test summary")
      .setIn(["description", "value"], "test description")
      .setIn(["operationid", "value"], "testid")
      .setIn(["tags", "value"], new List([tag.setIn(["tag", "value"], "test tag" )]))
    
    const object = operationObject(form)

    it("should correctly process the operation form into the operation object", () => {  
      const expected = {
        summary: "test summary",
        description: "test description",
        operationId: "testid",
        tags: ["test tag"],
        responses: {
          default: {
            description: "Default error sample response"
          }
        }
      }
  
      expect(object).toEqual(expected)
    })
  
    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(4)
      expect(wrapper.find("select").length).toEqual(2)
    })
  })

  describe("info object", () => {
    it("should correctly process the info form into the info object", () => {  
      const license = licenseForm(updateFormCallback, [], null)
        .setIn(["value", "name", "value"], "test name")
        .setIn(["value", "url", "value"], "test url")
        
      const contact = contactForm(updateFormCallback, [])
        .setIn(["value", "name", "value"], "test name")
        .setIn(["value", "url", "value"], "test url")
        .setIn(["value", "email", "value"], "testemail@test.com")
  
      form = form
        .setIn(["title", "value"], "test title")
        .setIn(["version", "value"], "test version")
        .setIn(["description", "value"], "test description")
        .setIn(["termsofservice", "value"], "testtermsofservice")
        .setIn(["license"], license)
        .setIn(["contact"], contact)
      
      const object = infoObject(form)
  
      const expected = {
        title: "test title",
        version: "test version",
        description: "test description",
        termsOfService: "testtermsofservice",
        license: {
          name: "test name",
          url: "test url"
        },
        contact: {
          name: "test name",
          url: "test url",
          email: "testemail@test.com"
        }
      }
  
      expect(object).toEqual(expected)
    })

    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(7)
    })
  })

  describe("path object", () => {
    it("should correctly process the path form into the path object", () => {

      form = pathForm(updateFormCallback, [])
  
      // Set some values as though the user had entered data
      form = form
        .setIn(["path", "value"], "/test")
        .setIn(["summary", "value"], "test summary")
        .setIn(["description", "value"], "test description")
  
      const object = pathObject(form)
      const expected = {
        key: "/test",
        value: {
          summary: "test summary",
          description: "test description"
        }
      }
      expect(object).toEqual(expected)
    })

    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(3)
    })
  })

  describe("tag declarations object", () => {
    it("should correctly process the tag declarations form into the tags object", () => {

      form = tagsForm(updateFormCallback, [])
  
      const externalDocs = externalDocumentationForm(updateFormCallback, [])
        .setIn(["url", "value"], "test url")
        .setIn(["description", "value"], "test description")
    
      const tag = tagForm(updateFormCallback, [])
        .setIn(["name", "value"], "test tag name")
        .setIn(["description", "value"], "test description")
        .setIn(["externalDocs", "value"], externalDocs)
  
      // Set some values as though the user had entered data
      form = form.setIn(["tags", "value"], new List([tag]))
  
      const object = tagsObject(form)
      const expected = [
        {
          name: "test tag name",
          description: "test description",
          externalDocs: {
            url: "test url",
            description: "test description"
          }
        }
      ]
      expect(object).toEqual(expected)
    })  

    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(2)
    })
  })

  describe("servers object", () => {
    it ("should correctly process the servers form into the servers object", () => {
      form = serversForm(updateFormCallback, [])
      const serverVariable = serverVariableForm(updateFormCallback, [])
        .setIn(["value", 0, "value", "default", "value"], "test default")
        .setIn(["value", 0, "value", "enum", "value"], fromJS([{ value: "test enum value"}]) )
        .setIn(["value", 0, "value", "vardescription", "value"], "test var description")
        .setIn(["value", 0, "keyValue"], "keyvalue")
  
      form = form
        .setIn(["servers", "value", 0, "url", "value"], "test url")
        .setIn(["servers", "value", 0, "description", "value"], "test description")
        .setIn(["servers", "value", 0, "variables"], serverVariable)
  
      const object = serversObject(form)
      const expected = [
        {
          url: "test url",
          description: "test description",
          variables: {
            keyvalue: {
              default: "test default",
              description: "test var description",
              enum: [
                "test enum value"
              ]
            }
          }
        }
      ]
  
      expect(object).toEqual(expected)
    })

    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(6)
    })
  })

  describe("add tags object", () => {
    it ("should correctly process the add tags to operation into the add tags object", () => {
      const selectOperation = selectOperationForm(updateFormCallback, [])
        .setIn(["path", "value"], "/test")
        .setIn(["operation", "value"], "GET")
  
      form = addOperationTagsForm(updateFormCallback, [])
        .setIn(["selectoperation", "value"], selectOperation)
        .setIn(["tags", "value", 0, "tag", "value"], "test tag")
  
      const object = addOperationTagsObject(form)
  
      const expected = {
        selectedOperation: ["paths", "/test", "GET"],
        tags: [
          "test tag"
        ]
      }
  
      expect(object).toEqual(expected)
    })

    it ("should correctly render the form object with getForm", () => {
      const element = <div> {getForm(form)} </div>
      const wrapper = mount(element)
  
      expect(wrapper.find("input").length).toEqual(1)
      expect(wrapper.find("select").length).toEqual(2)
    })
  })
})
