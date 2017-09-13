import expect from "expect"
import { condenseErrors } from "plugins/validation/structural-validation/condense-errors"

describe("validation plugin - structural - condenseErrors helper", () => {
  it("should return an empty array when called with an incorrect type", () => {
    expect(condenseErrors()).toEqual([])
    expect(condenseErrors(null)).toEqual([])
    expect(condenseErrors(undefined)).toEqual([])
    expect(condenseErrors(0)).toEqual([])
    expect(condenseErrors(1)).toEqual([])
    expect(condenseErrors("asdf")).toEqual([])
    expect(condenseErrors({})).toEqual([])
  })

  it("should return an empty array when called with an empty array", () => {
    expect(condenseErrors([])).toEqual([])
  })

  it("should return an unmodified array of unique errors", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "message 1"
      },
      {
        dataPath: "bravo",
        message: "message 2"
      },
      {
        dataPath: "charlie",
        message: "message 1"
      },
      {
        dataPath: "delta",
        message: "message 2"
      },
    ]

    expect(condenseErrors(errors)).toEqual(errors)
  })

  it("should select the most frequent error when multiple error messages exist for a path", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "not popular"
      },
      {
        dataPath: "bravo",
        message: "not popular"
      },
    ]

    expect(condenseErrors(errors)).toEqual([
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "bravo",
        message: "not popular"
      },
    ])
  })

  it("should handle two errors at a path being equally popular", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "bravo",
        message: "popular"
      },
    ]

    expect(condenseErrors(errors)).toEqual([
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "bravo",
        message: "popular"
      },
    ])
  })

  it("should handle three errors at a path being equally popular", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "alpha",
        message: "also popular"
      },
      {
        dataPath: "alpha",
        message: "also popular"
      },
      {
        dataPath: "bravo",
        message: "popular"
      },
    ]

    expect(condenseErrors(errors)).toEqual([
      {
        dataPath: "alpha",
        message: "very popular"
      },
      {
        dataPath: "alpha",
        message: "equally popular"
      },
      {
        dataPath: "alpha",
        message: "also popular"
      },
      {
        dataPath: "bravo",
        message: "popular"
      },
    ])
  })

  it("should concat the params of each instance of the most popular message at each path", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": "green"
        }
      },
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": "blue"
        }
      },
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": "purple"
        }
      },
      {
        dataPath: "alpha",
        message: "not popular"
      },
      {
        dataPath: "bravo",
        message: "popular",
        params: {
          "favColor": "black"
        }
      },
    ]

    expect(condenseErrors(errors)).toEqual([
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": ["green", "blue", "purple"]
        }
      },
      {
        dataPath: "bravo",
        message: "popular",
        params: {
          "favColor": "black"
        }
      },
    ])
  })

  it("should concat the params of each instance of the most popular message at each path when two messages at a path are equally popular", () => {
    const errors = [
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": "green",
          "favFood": "pizza"
        }
      },
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": "blue",
          "favFood": "salad"
        }
      },
      {
        dataPath: "alpha",
        message: "also very popular",
        params: {
          "favColor": "purple"
        }
      },
      {
        dataPath: "alpha",
        message: "also very popular",
        params: {
          "favColor": "pink"
        }
      },
      {
        dataPath: "bravo",
        message: "popular",
        params: {
          "favColor": "black"
        }
      },
    ]

    expect(condenseErrors(errors)).toEqual([
      {
        dataPath: "alpha",
        message: "very popular",
        params: {
          "favColor": ["green", "blue"],
          "favFood": ["pizza", "salad"]
        }
      },
      {
        dataPath: "alpha",
        message: "also very popular",
        params: {
          "favColor": ["purple", "pink"]
        }
      },
      {
        dataPath: "bravo",
        message: "popular",
        params: {
          "favColor": "black"
        }
      },
    ])
  })
})
