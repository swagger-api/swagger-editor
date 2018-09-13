import SwaggerUi from "swagger-ui"
import EditorSpecPlugin from "src/plugins/editor/spec"
import expect from "expect"

describe("editor state plugins", function() {
  describe("specSelectors.specOrigin", function() {
    it("should default to 'non-editor'", function() {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]})

      // When
      const res = system.specSelectors.specOrigin()

      // Then
      expect(res).toEqual("not-editor")
    })
  })
  describe("specActions.updateSpec", function() {
    it("should add a parameter - origin - to state", function() {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]})

      // When
      system.specActions.updateSpec("one: 1", "editor")

      // Then
      const res = system.specSelectors.specOrigin()
      expect(res).toEqual("editor")
    })

    it("should default to 'non-editor'", function() {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]})

      // When
      system.specActions.updateSpec("one: 1")

      // Then
      const res = system.specSelectors.specOrigin()
      expect(res).toEqual("not-editor")
    })
  })
})
