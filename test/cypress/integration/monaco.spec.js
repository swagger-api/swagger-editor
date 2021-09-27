describe('Monaco Editor with Parser', () => {
  beforeEach(() => {
    // intercept default hardcoded petstore URI with a fixture
    cy.intercept('GET', 'https://petstore3.swagger.io/api/v3/openapi.yaml', {
      fixture: 'petstore-oas3.yaml',
    }).as('externalPetstore');

    const staticResponse = {
      servers: ['blue', 'brown'],
      clients: ['apple', 'avocado'],
    };
    cy.intercept('GET', 'https://generator3.swagger.io/api/servers', staticResponse).as(
      'externalGeneratorServers'
    );
    cy.intercept('GET', 'https://generator3.swagger.io/api/clients', staticResponse).as(
      'externalGeneratorClients'
    );

    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in cy support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });

    cy.visit('/', {});
    cy.wait('@externalPetstore');
    cy.wait('@externalGeneratorServers');
    cy.wait('@externalGeneratorClients');
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
