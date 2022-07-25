describe('Monaco Editor with Parser', () => {
  const selectAllKeys = ['darwin'].includes(Cypress.platform) ? '{cmd}a' : '{ctrl}a';

  beforeEach(() => {
    cy.visitBlankPage();
    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in cy support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();
  });

  it('should not throw console.error when parsing empty string', () => {
    cy.get('.monaco-editor textarea:first')
      .should('be.visible')
      .click({ force: true })
      .focused()
      .type(selectAllKeys)
      .clear();

    cy.waitForContentPropagation();

    cy.get('@consoleError').should('not.be.called');
    cy.get('.monaco-editor .view-lines').should('contains.text', '');
  });

  it('should not throw console.error when parsing unsupported definition', () => {
    cy.get('.monaco-editor textarea:first')
      .should('be.visible')
      .click({ force: true })
      .focused()
      .type(selectAllKeys)
      .type('randomapi: 1.0.0\n');

    cy.waitForContentPropagation();

    cy.get('@consoleError').should('not.be.called');
    cy.get('.monaco-editor .view-lines').should('contains.text', 'randomapi');
  });
});
