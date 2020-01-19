import expect, { createSpy } from "expect"
import dedent from "dedent"
import { getPathForPosition } from "src/plugins/editor-autosuggest/fn.js"

describe("Editor Autosuggest Plugin", function() {
  describe("getPathForPosition - YAML value preparation", function() {
    it.skip("should not modify a valid simple map", function() {
      // Given
      const editorValue = dedent(`
        a: "one"
        b: "two"
      `)
      const pos = { row: 0, col: 0 }
      const AST = {
        pathForPosition: createSpy()
      }

      // When
      getPathForPosition({ editorValue, pos, prefix: "", AST })

      // Then
      expect(AST.pathForPosition).toHaveBeenCalled()

      const [preparedEditorValue] = AST.pathForPosition.calls[0].arguments
      expect(preparedEditorValue).toEqual(editorValue) // should be unchanged
    })
    it("should modify an array member map fragment", function() {
      // Given
      const editorValue = dedent(`
        myArray:
        - one: "abc"
        - two: 
      `)
      const pos = { row: 2, col: 6 }
      const AST = {
        pathForPosition: createSpy()
      }

      // When
      getPathForPosition({ editorValue, pos, prefix: "", AST })

      // Then
      expect(AST.pathForPosition).toHaveBeenCalled()

      const [preparedEditorValue] = AST.pathForPosition.calls[0].arguments
      expect(preparedEditorValue).toEqual(editorValue + " ~")
    })
  })
})
