import SwaggerEditor from '../../dist/swagger-editor-es-bundle';

describe('webpack browser es-bundle build', () => {
  test('should export a function for es-bundle', () => {
    expect(SwaggerEditor).toBeInstanceOf(Function);
  });
});
