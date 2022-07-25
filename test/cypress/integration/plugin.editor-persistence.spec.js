describe('EditorPersistencePlugin', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();
  });

  it('should load definition with provided url prop', () => {
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', 'asyncapi')
      .should('contains.text', '2.4.0');
  });

  it('should reload while keeping text change from 2.4.0 to 2.3.0', () => {
    const moveToPosition = `{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}`;

    cy.get('.monaco-editor textarea:first', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
      .focused()
      .type(`${moveToPosition}{shift+rightArrow}3`);

    cy.waitForContentPropagation();

    cy.get('.monaco-editor .view-lines').should('contains.text', '2.3.0');

    cy.reload(true);

    cy.waitForSplashScreen();
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.3.0')
      .should('not.contains.text', '2.4.0');
  });
});
