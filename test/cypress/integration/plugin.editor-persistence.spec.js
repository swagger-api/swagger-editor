describe('EditorPersistencePlugin', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareOasGenerator();
  });

  it('should load definition with provided url prop', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    cy.get('.monaco-editor .view-lines')
      .should('contains.text', 'asyncapi')
      .should('contains.text', '2.6.0');
  });

  it.skip('should reload while keeping text change from 2.6.0 to 2.5.0', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    const moveToPosition = `{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}`;

    cy.get('.monaco-editor textarea:first', { timeout: 10000 }).should('be.visible');
    cy.get('.monaco-editor textarea:first').click({ force: true });
    cy.get('.monaco-editor textarea:first').focused();
    cy.get('.monaco-editor textarea:first').type(`${moveToPosition}{shift+rightArrow}5`);

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
