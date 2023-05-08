// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands.js';
import 'cypress-file-upload';

Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error', (msg) => {
    cy.now('task', 'error', msg);
  });

  cy.stub(win.console, 'warn', (msg) => {
    cy.now('task', 'warn', msg);
  });
});

Cypress.on('uncaught:exception', (err) => {
  cy.now('task', 'uncaught', err);
  return true; // true = fail the test
});

Cypress.Commands.add('prepareAsyncAPI', () => {
  cy.intercept(
    'GET',
    'https://raw.githubusercontent.com/asyncapi/spec/v2.6.0/examples/streetlights-kafka.yml',
    {
      fixture: 'streetlights-kafka.yml',
    }
  ).as('streetlightsKafka');

  cy.visit('/');
  cy.wait('@streetlightsKafka');
});

Cypress.Commands.add('prepareOpenAPI30x', () => {
  cy.intercept('GET', 'https://petstore3.swagger.io/api/v3/openapi.json', {
    fixture: 'petstore-oas3.yaml',
  }).as('externalPetstore');

  cy.visit('/');
  cy.wait(['@externalPetstore']);
});

Cypress.Commands.add('prepareOasGenerator', () => {
  const staticResponse = {
    servers: ['blue', 'brown'],
    clients: ['apple', 'avocado'],
  };
  const staticFixture = {
    fixture: 'rejected.file.1', // picking a minimal file, doesn't matter what it is
  };
  const staticOas2resDownloadUrl = {
    link: 'https://generator.swagger.io/api/gen/download/mocked-hash',
  };

  cy.intercept('GET', 'https://generator3.swagger.io/api/servers', staticResponse.servers).as(
    'externalGeneratorServersOas3reqList'
  );
  cy.intercept('GET', 'https://generator3.swagger.io/api/clients', staticResponse.clients).as(
    'externalGeneratorClientsOas3reqList'
  );
  // OAS3 server and client generators uses same URI
  cy.intercept('POST', 'https://generator3.swagger.io/api/generate', staticFixture).as(
    'externalGeneratorOas3Download'
  );

  cy.intercept('GET', 'https://generator.swagger.io/api/gen/servers', staticResponse.servers).as(
    'externalGeneratorServersOAS2reqList'
  );
  cy.intercept('GET', 'https://generator.swagger.io/api/gen/clients', staticResponse.clients).as(
    'externalGeneratorClientsOAS2reqList'
  );
  cy.intercept(
    'POST',
    'https://generator.swagger.io/api/gen/servers/*',
    staticOas2resDownloadUrl
  ).as('externalGeneratorServersOAS2reqDownloadUrl');
  cy.intercept(
    'POST',
    'https://generator.swagger.io/api/gen/clients/*',
    staticOas2resDownloadUrl
  ).as('externalGeneratorClientsOAS2reqDownloadUrl');
  // OAS2 server and client generators uses same base URI, but all requests have an appended hash
  cy.intercept(
    'GET',
    'https://generator.swagger.io/api/gen/download/mocked-hash',
    staticFixture
  ).as('externalGeneratorOas2Download');

  // always return same OAS3 fixture. not testing the actual http service to convert
  cy.intercept('POST', 'https://converter.swagger.io/api/convert', {
    fixture: 'petstore-oas3.yaml',
  }).as('externalConverterToOas3');
});

Cypress.Commands.add('clearDownloadsFolder', () => {
  cy.exec('rm cypress/downloads/*', { log: true, failOnNonZeroExit: false });
});

Cypress.Commands.add('waitForSplashScreen', () => {
  cy.get('.swagger-editor__splash-screen', { timeout: 10000 }).should('not.be.visible');
});

Cypress.Commands.add('waitForContentPropagation', () => {
  /**
   * Content is propagated to application after 500ms debouncing.
   */
  // eslint-disable-next-line testing-library/await-async-utils,cypress/no-unnecessary-waiting
  cy.wait(600);
});

Cypress.Commands.add('visitBlankPage', () => {
  cy.window().then((win) => {
    // eslint-disable-next-line no-param-reassign
    win.location.href = 'about:blank';
  });
});
