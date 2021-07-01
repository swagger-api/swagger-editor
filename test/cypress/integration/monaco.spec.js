describe('Monaco Editor with Parser', () => {
  beforeEach(() => {
    // wait for external https request
    // to help page finish loading and rendering
    cy.intercept('GET', '/api/servers').as('externalRequest');
    cy.visit('/', {
      onBeforeLoad: (contentWindow) => {
        if (contentWindow.console.error) {
          contentWindow.console.error.restore();
        }
        cy.stub(contentWindow.console, 'error').as('consoleError');
      },
    });
    cy.wait('@externalRequest');
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
    cy.get('.monaco-editor .view-lines').should('contains.text', '');
  });

  it('should not throw console.error when parsing unsupported definition', () => {
    cy.get('.monaco-editor textarea:first')
      .click()
      .focused()
      .type(selectAllKeys)
      .type('randomapi: 1.0.0\n');
    cy.get('@consoleError').should('not.be.called');
    cy.get('.monaco-editor .view-lines').should('contains.text', 'randomapi');
  });
});
