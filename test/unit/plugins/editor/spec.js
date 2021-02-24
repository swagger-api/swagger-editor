import SwaggerUi from 'swagger-ui';
import EditorSpecPlugin from 'src/plugins/editor/spec';

describe('editor state plugins', () => {
  describe('specSelectors.specOrigin', () => {
    it('should default to \'non-editor\'', () => {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]});

      // When
      const res = system.specSelectors.specOrigin();

      // Then
      expect(res).toEqual('not-editor');
    });
  });
  describe('specActions.updateSpec', () => {
    it('should add a parameter - origin - to state', () => {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]});

      // When
      system.specActions.updateSpec('one: 1', 'editor');

      // Then
      const res = system.specSelectors.specOrigin();
      expect(res).toEqual('editor');
    });

    it('should default to \'non-editor\'', () => {
      // Given
      const system = SwaggerUi({plugins: [EditorSpecPlugin]});

      // When
      system.specActions.updateSpec('one: 1');

      // Then
      const res = system.specSelectors.specOrigin();
      expect(res).toEqual('not-editor');
    });
  });
});
