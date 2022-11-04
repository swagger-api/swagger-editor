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
      .should('contains.text', '2.5.0');
  });

  it.skip('should reload while keeping text change from 2.5.0 to 2.4.0', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    const moveToPosition = `{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}`;

    cy.get('.monaco-editor textarea:first', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })
      .focused()
      .type(`${moveToPosition}{shift+rightArrow}4`);

    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.4.0')
      .should('not.contains.text', '2.5.0');

    cy.waitForContentPropagation();
    cy.reload();

    cy.waitForSplashScreen();
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.4.0')
      .should('not.contains.text', '2.5.0');
  });
});
