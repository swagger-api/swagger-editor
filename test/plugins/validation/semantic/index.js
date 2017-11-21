import expect from "expect"
import { runSemanticValidators } from "src/plugins/validation/semantic-validators/hook.js"

import {
  PetstoreExpandedRaw,
  PetstoreExpandedDereferenced
} from "../data/petstore-expanded.swagger.js"

describe("semantic validation integration tests", () => {
  describe("Swagger2 Petstore Expanded", () => {
    it.only("should not return any problems about the petstore definition", () => {
      const res = runSemanticValidators({
        jsSpec: PetstoreExpandedRaw,
        resolvedSpec: PetstoreExpandedDereferenced,
        specStr: JSON.stringify(PetstoreExpandedRaw),
        getLineNumberForPath: () => null
      })

      expect(res).toEqual([])
    })
  })
})
