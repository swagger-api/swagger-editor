describe('EditorPersistencePlugin', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareOasGenerator();
  });

  it('should load definition', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    cy.get('.monaco-editor .view-lines')
      .should('contains.text', 'asyncapi')
      .should('contains.text', '2.6.0');
  });

  /**
   * This test is extremely flaky, it fails randomly.
   * TODO(vladimir.gorej@gmail.com): fix this test.
   */
  it.skip('should reload while keeping text change from 2.6.0 to 2.5.0', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    cy.selectEditorText({ startLineNumber: 1, startColumn: 14, endLineNumber: 1, endColumn: 15 });
    cy.typeInEditor('5');

    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.5.0')
      .should('not.contains.text', '2.6.0');

    cy.waitForContentPropagation();
    cy.reload();

    cy.waitForSplashScreen();
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.5.0')
      .should('not.contains.text', '2.6.0');
  });
});
