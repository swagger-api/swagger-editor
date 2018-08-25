/* eslint-env mocha */
import expect from "expect"
import { pathForPosition, positionRangeForPath } from "plugins/ast/ast"

describe("ASTManager", function() {
  describe("#pathForPosition", function () {
    describe("out of range", function () {
      it("returns empty array for out of range row", function () {
        let position = { line: 3, column: 0 }
        let path = pathForPosition("swagger: 2.0", position)

        expect(path).toEqual([])
      })

      it("returns empty array for out of range column", function () {
        let position = { line: 0, column: 100 }
        let path = pathForPosition("swagger: 2.0", position)

        expect(path).toEqual([])
      })
    })

    describe("when document is a simple hash `swagger: 2.0`", function () {
      it("should return empty array when pointer is at middle of the hash key", function () {
        let position = { line: 0, column: 3 }
        let path = pathForPosition("swagger: 2.0", position)

        expect(path).toEqual([])
      })

      it("should return ['swagger'] when pointer is at the value", function () {
        let position = { line: 0, column: 10 }
        let path = pathForPosition("swagger: 2.0", position)

        expect(path).toEqual(["swagger"])
      })
    })

    describe("when document is an array: ['abc', 'cde']", function () {
      let yaml = [
        /*
        0
        01234567 */
        /* 0 */ "- abc",
        /* 1 */ "- def"
      ].join("\n")

      it("should return empty array when pointer is at array dash", function () {
        let position = { line: 0, column: 0 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual([])
      })

      it("should return ['0'] when pointer is at abc", function () {
        let position = { line: 0, column: 3 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["0"])
      })

      it("should return ['1'] when pointer is at abc", function () {
        let position = { line: 1, column: 3 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["1"])
      })
    })

    describe("when document is an array of arrays", function () {
      let yaml = [
        /*
        0         10
        0123456789012345 */
        /* 0 */ "-",
        /* 1 */ " - abc",
        /* 2 */ " - def",
        /* 3 */ "-",
        /* 4 */ " - ABC",
        /* 5 */ " - DEF"
      ].join("\n")

      it("should return ['0', '0'] when pointer is at 'abc'", function () {
        let position = { line: 1, column: 5 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["0", "0"])
      })
    })

    describe("when document is an array of hashs", function () {
      let yaml = [
        /*
        0         10
        0123456789012345 */
        /* 0 */ "- key: value",
        /* 1 */ "  num: 1",
        /* 2 */ "- name: Tesla",
        /* 3 */ "  year: 2016"
      ].join("\n")

      it("should return ['0'] when pointer is at 'key'", function () {
        let position = { line: 0, column: 3 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["0"])
      })

      it("should return ['0', 'key'] when pointer is at 'value'", function () {
        let position = { line: 0, column: 9 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["0", "key"])
      })

      it("should return ['1', 'year'] when pointer is at '2016'", function () {
        let position = { line: 3, column: 10 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["1", "year"])
      })
    })

    describe("full document", function () {
      let yaml = [
        /*
        0         10        20        30
        012345678901234567890123456789012345678 */
        /* 0 */ "swagger: '2.0'",
        /* 1 */ "info:",
        /* 2 */ "  title: Test document",
        /* 3 */ "  version: 0.0.1",
        /* 4 */ "  contact:",
        /* 5 */ "    name: Sahar",
        /* 6 */ "    url: github.com",
        /* 7 */ "    email: me@example.com",
        /* 8 */ "                         "
      ].join("\n")

      it("should return ['info', 'contact', 'email'] when pointer is at me@", function () {
        let position = { line: 7, column: 13 }
        let path = pathForPosition(yaml, position)

        expect(path).toEqual(["info", "contact", "email"])
      })
    })

  })

  describe("#positionRangeForPath", function() {
    it("return {{-1, -1}, {-1, -1}} for invalid paths", function() {
      let yaml = [
        "key: value",
        "anotherKey: value"
      ].join("\n")

      let position = positionRangeForPath(yaml, ["invalid"])

      expect(position.start).toEqual({
        line: -1,
        column: -1
      })
      expect(position.end).toEqual({
        line: -1,
        column: -1
      })
    })

    describe("when document is a simple hash `swagger: 2.0`", function() {
      let yaml = "swagger: 2.0"

      it("return {0, 0} for start of empty array path (root)", function() {
        let position = positionRangeForPath(yaml, [])

        expect(position.start).toEqual({
          line: 0,
          column: 0,
          pointer: 0
        })
      })

      it("return {0, 12} for end of empty array path (root)", function() {
        let position = positionRangeForPath(yaml, [])

        expect(position.end).toEqual({
          line: 0,
          column: 12,
          pointer: 12
        })
      })

      it("return {0, 9} for start of ['swagger']", function() {
        let position = positionRangeForPath(yaml, ["swagger"])

        expect(position.start).toEqual({
          line: 0,
          column: 9,
          pointer: 9
        })
      })

      it("return {0, 12} for end of ['swagger']", function() {
        let position = positionRangeForPath(yaml, ["swagger"])

        expect(position.end).toEqual({
          line: 0,
          column: 12,
          pointer: 12
        })
      })
    })

    describe("when document is an array of primitives", function() {
      let yaml = [
        "key:",
        "  - value1",
        "  - value2"
      ].join("\n")

      it("returns {1, 4} for ['key', '0']", function() {
        let position = positionRangeForPath(yaml, ["key", "0"])

        expect(position.start).toEqual({
          line: 1,
          column: 4,
          pointer: 9
        })
      })
    })

    describe("full document", function() {
      let yaml = [
        /*
                 0         10        20        30
                 012345678901234567890123456789012345678 */
        /* 0 */ "swagger: '2.0'",
        /* 1 */ "info:",
        /* 2 */ "  title: Test document",
        /* 3 */ "  version: 0.0.1",
        /* 4 */ "  contact:",
        /* 5 */ "    name: Sahar",
        /* 6 */ "    url: github.com",
        /* 7 */ "    email: me@example.com",
        /* 8 */ "                         "
      ].join("\n")

      it("returns {2, 2} for start of ['info']", function() {
        let position = positionRangeForPath(yaml, ["info"])

        expect(position.start).toEqual({
          line: 2,
          column: 2,
          pointer: 23
        })
      })

      it("returns {5, 10} for start of ['info', 'contact', 'name']", function() {
        let position = positionRangeForPath(yaml, ["info", "contact", "name"])

        expect(position.start).toEqual({
          line: 5,
          column: 10,
          pointer: 82
        })
      })

      it("returns {5, 15} for end of ['info', 'contact', 'name']", function() {
        let position = positionRangeForPath(yaml, ["info", "contact", "name"])

        expect(position.end).toEqual({
          line: 5,
          column: 15,
          pointer: 87
        })
      })
    })
  })
})
