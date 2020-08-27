import dedent from 'dedent';
import { getPathForPosition } from 'src/plugins/editor-autosuggest/fn.js';

describe('Editor Autosuggest Plugin', () => {
  describe('getPathForPosition - YAML value preparation', () => {
    it.skip('should not modify a valid simple map', function() {
      // Given
      const editorValue = dedent(`
        a: "one"
        b: "two"
      `);
      const pos = { row: 0, col: 0 };
      const AST = {
        pathForPosition: jest.fn()
      };

      // When
      getPathForPosition({ editorValue, pos, prefix: '', AST });

      // Then
      expect(AST.pathForPosition).toHaveBeenCalled();

      const [preparedEditorValue] = AST.pathForPosition.mock.calls[0];
      expect(preparedEditorValue).toEqual(editorValue); // should be unchanged
    });

    it('should modify an array member map fragment', () => {
      // Given
      const editorValue = dedent(`
        myArray:
        - one: "abc"
        - two: 
      `);
      const pos = { row: 2, col: 6 };
      const AST = {
        pathForPosition: jest.fn()
      };

      // When
      getPathForPosition({ editorValue, pos, prefix: '', AST });

      // Then
      expect(AST.pathForPosition).toHaveBeenCalled();
      const [preparedEditorValue] = AST.pathForPosition.mock.calls[0];
      expect(preparedEditorValue).toEqual(editorValue + ' ~');
    });
  });
});
