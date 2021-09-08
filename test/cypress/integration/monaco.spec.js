describe('Monaco Editor with Parser', () => {
  beforeEach(() => {
    const staticResponse = {
      servers: ['blue', 'brown'],
      clients: ['apple', 'avocado'],
    };
    // intercept, mock with staticResponse, and wait
    cy.intercept('GET', '/api/servers', staticResponse).as('externalRequest');
    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });
    cy.visit('/', {});
    // wait for async
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
