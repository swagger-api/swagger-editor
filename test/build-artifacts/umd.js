import SwaggerEditor from '../../dist/swagger-editor-bundle';

describe('webpack browser es-bundle build', () => {
  test('should export a function for es-bundle', () => {
    expect(SwaggerEditor).toBeInstanceOf(Function);
  });
});
