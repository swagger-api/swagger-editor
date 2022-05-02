import SwaggerEditor from '../../dist/swagger-editor-es-bundle-core';

describe('webpack browser es-bundle-core build', () => {
  test('should export a function for es-bundle-core', () => {
    expect(SwaggerEditor).toBeInstanceOf(Function);
  });
});
