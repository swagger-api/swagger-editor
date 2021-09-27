describe('App', () => {
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

  it('renders the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    cy.findByText('File').should('exist');
  });
});
