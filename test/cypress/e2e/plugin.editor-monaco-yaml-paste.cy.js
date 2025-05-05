describe('EditorMonacoYamlPastePlugin', () => {
  // eslint-disable-next-line func-names
  beforeEach(function () {
    if (Cypress.browser.isHeadless) this.skip();

    cy.visitBlankPage();
    cy.prepareOpenAPI20();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  describe('when I replace the text in editor by pasting a new JSON text', () => {
    it('should convert JSON to YAML', () => {
      cy.selectAllEditorText();
      cy.pasteToEditor(
        `{
            "openapi": "3.1.0",
            "info": {
              "title": "Swagger Petstore - OpenAPI 3.1",
              "version": "1.0.11",
              "termsOfService": "http://swagger.io/terms/",
              "contact": {
                "email": "apiteam@swagger.io"
              }
            }
          }`
      );
      cy.waitForContentPropagation();
      cy.contains('OK').click();

      cy.getAllEditorText().should(
        'equal',
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  termsOfService: http://swagger.io/terms/\n  contact:\n    email: apiteam@swagger.io\n'
      );
    });

    it('should add padding', () => {
      cy.selectAllEditorText();

      cy.pasteToEditor(
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  '
      );
      cy.waitForContentPropagation();

      cy.pasteToEditor(
        '{"termsOfService":"http://swagger.io/terms/","contact":{"email": "apiteam@swagger.io"}}'
      );
      cy.waitForContentPropagation();

      cy.contains('OK').click();

      cy.getAllEditorText().should(
        'equal',
        'openapi: 3.1.0\ninfo:\n  title: Swagger Petstore - OpenAPI 3.1\n  version: 1.0.11\n  termsOfService: http://swagger.io/terms/\n  contact:\n    email: apiteam@swagger.io\n  '
      );
    });
  });
});
