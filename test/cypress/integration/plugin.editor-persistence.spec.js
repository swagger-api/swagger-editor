describe('EditorPersistencePlugin', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareOasGenerator();
  });

  it('should load definition with provided url prop', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    cy.get('.monaco-editor .view-lines > :nth-child(1)')
      .should('contains.text', 'asyncapi')
      .should('contains.text', '2.4.0');
  });

  it('should reload while keeping text change from 2.4.0 to 2.3.0', () => {
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();

    const moveToPosition = `{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}`;

    cy.get('.monaco-editor textarea:first')
      .should('be.visible')
      .click({ force: true })
      .focused()
      .type(`${moveToPosition}{shift+rightArrow}3`);

    cy.get('.monaco-editor .view-lines > :nth-child(1)')
      .should('contains.text', '2.3.0')
      .should('not.contains.text', '2.4.0');

    cy.waitForContentPropagation();
    cy.reload();

    cy.waitForSplashScreen();
    cy.get('.monaco-editor .view-lines > :nth-child(1)')
      .should('contains.text', '2.3.0')
      .should('not.contains.text', '2.4.0');
  });
});
