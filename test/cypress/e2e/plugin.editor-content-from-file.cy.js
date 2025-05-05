describe('EditorContentFromFilePlugin', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('should convert JSON to YAML after importing an URL', () => {
    cy.intercept('GET', 'https://example.com/import-example.json', {
      fixture: 'import-example.json',
    }).as('importExample');

    cy.contains('File').click();
    cy.contains('Import URL').click();
    cy.get('.form-control').type('https://example.com/import-example.json');
    cy.contains('OK').click();

    cy.waitForContentPropagation();

    cy.get('.monaco-editor .view-line').contains('Example API');

    cy.getAllEditorText().should(
      'equal',
      'openapi: 3.0.4\ninfo:\n  title: Example API\n  version: 1.0.0\npaths: {}\n'
    );
  });
});
