describe('Monaco Editor with Parser', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (contentWindow) => {
        if (contentWindow.console.error) {
          contentWindow.console.error.restore();
        }
        cy.stub(contentWindow.console, 'error').as('consoleError');
      },
    });
  });

  const detectedPlatform = Cypress.platform;
  let selectAllKeys;
  if (detectedPlatform === 'darwin' || detectedPlatform === 'linux') {
    selectAllKeys = '{cmd}a';
  } else {
    selectAllKeys = '{ctrl}a';
  }

  it('should not throw console.error when parsing empty string', () => {
    cy.get('.monaco-editor textarea:first').click().focused().type(selectAllKeys).clear();
    cy.get('@consoleError').should('not.be.called');
  });

  it('should not throw console.error when parsing unsupported definition', () => {
    cy.get('.monaco-editor textarea:first')
      .click()
      .focused()
      .type(selectAllKeys)
      .type('randomapi: 1.0.0\n');
    cy.get('@consoleError').should('not.be.called');
  });
});
