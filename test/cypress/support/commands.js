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
    'https://raw.githubusercontent.com/asyncapi/spec/v2.3.0/examples/streetlights-kafka.yml',
    {
      fixture: 'streetlights-kafka.yml',
    }
  ).as('streetlightsKafka');

  cy.visit('/');
  cy.wait('@streetlightsKafka');
});

Cypress.Commands.add('prepareOpenAPI', () => {
  cy.intercept('GET', 'https://petstore3.swagger.io/api/v3/openapi.json', {
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

  cy.visit('/');
  cy.wait(['@externalPetstore', '@externalGeneratorServers', '@externalGeneratorClients']);
});
