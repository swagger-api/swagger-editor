/* eslint-disable testing-library/await-async-utils */
/* eslint-disable testing-library/await-async-query */

/**
 * disable above rules to cover cy.wait, cy.findByText
 * where using async/await withing Cypress is discouraged
 * this is a linting compatibility mismatch between testing-library and Cypress
 */

describe('App', () => {
  beforeEach(() => {
    /*
      // intercept default hardcoded petstore URI with a fixture
      cy.intercept('GET', 'https://petstore3.swagger.io/api/v3/openapi.yaml', {
        fixture: 'petstore-oas3.yaml',
      }).as('externalPetstore');
    */

    // intercept default hardcoded asyncapi URI with a fixture
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
      {
        fixture: 'streetlights-kafka.yml',
      }
    ).as('streetlightsKafka');

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
    // tests when initial URL is set to AsyncAPI streetlights-kafka.yml
    cy.wait('@streetlightsKafka');
    /*
    // tests when initial URL is set to OAS 3.0 spec
    cy.wait('@externalPetstore');
    cy.wait('@externalGeneratorServers');
    cy.wait('@externalGeneratorClients');
    */
  });

  it('renders the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    cy.findByText('File').should('exist');
  });
});
