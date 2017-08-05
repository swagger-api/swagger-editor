import expect from "expect"
import { uniqueErrors } from "plugins/validation/structural-validation/unique-errors"

describe("validation plugin - structural - uniqueErrors helper", () => {
  it("should return an empty array when called with an incorrect type", () => {
    expect(uniqueErrors()).toEqual([])
    expect(uniqueErrors(null)).toEqual([])
    expect(uniqueErrors(undefined)).toEqual([])
    expect(uniqueErrors(0)).toEqual([])
    expect(uniqueErrors(1)).toEqual([])
    expect(uniqueErrors("asdf")).toEqual([])
    expect(uniqueErrors({})).toEqual([])
  })

  it("should return an empty array when called with an empty array", () => {
    expect(uniqueErrors([])).toEqual([])
  })

  it("should return an unmodified array of unique errors", () => {
    const errors = [
      {
        dataPath: "a.b",
        message: "type 1"
      },
      {
        dataPath: "a.b",
        message: "type 2"
      },
      {
        dataPath: "a.c",
        message: "type 1"
      },
      {
        dataPath: "a.c",
        message: "type 2"
      },
    ]

    expect(uniqueErrors(errors)).toEqual(errors)
  })

  it("should return a uniqued array of duplicate errors (dataPath + message)", () => {
    const errors = [
      {
        dataPath: "a.b",
        message: "type 1"
      },
      {
        dataPath: "a.b",
        message: "type 1"
      },
      {
        dataPath: "a.c",
        message: "type 1"
      },
      {
        dataPath: "a.c",
        message: "type 1"
      },
    ]

    expect(uniqueErrors(errors)).toEqual([
      {
        dataPath: "a.b",
        message: "type 1"
      },
      {
        dataPath: "a.c",
        message: "type 1"
      },
    ])
  })
})
