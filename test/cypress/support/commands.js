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

Cypress.Commands.add('prepareAsyncAPI', () => {
  cy.visit('/');
});

Cypress.Commands.add('prepareOpenAPI30x', () => {
  cy.intercept('GET', 'https://petstore3.swagger.io/api/v3/openapi.json', {
    fixture: 'petstore-oas3.json',
  }).as('externalPetstore');

  cy.visit('/?url=https://petstore3.swagger.io/api/v3/openapi.json');
  cy.wait(['@externalPetstore']);
});

Cypress.Commands.add('prepareOpenAPI20', () => {
  cy.intercept('GET', 'https://petstore.swagger.io/v2/swagger.yaml', {
    fixture: 'petstore-oas2.yaml',
  }).as('externalPetstore');

  cy.visit('/?url=https://petstore.swagger.io/v2/swagger.yaml');
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
  cy.get('.swagger-editor__splash-screen', { timeout: 15000 }).should('not.be.visible');
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

Cypress.Commands.add('openEditorContextMenu', () => {
  cy.window().then((win) => {
    win.monaco.trigger('keyboard', 'editor.action.showContextMenu', null); // Open the Monaco context menu
  });
});

Cypress.Commands.add('focusEditorText', (position = { lineNumber: 1, column: 1 }) => {
  cy.window().then((win) => {
    win.monaco.setPosition(position, 'mouse');
    win.monaco.focus();
  });
});

Cypress.Commands.add(
  'selectEditorText',
  (selection = { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }) => {
    cy.window().then((win) => {
      win.monaco.setSelection(selection);
      win.monaco.focus();
    });
  }
);

Cypress.Commands.add('typeInEditor', (text, { range } = {}) => {
  cy.window().then((win) => {
    if (range) {
      win.monaco.executeEdits('', [
        {
          range,
          text,
          forceMoveMarkers: true,
        },
      ]);
    } else {
      win.monaco.trigger('keyboard', 'type', { text });
    }
  });
});

Cypress.Commands.add('typeBackspaceInEditor', () => {
  cy.window().then((win) => {
    win.monaco.trigger('keyboard', 'deleteLeft', null);
  });
});

Cypress.Commands.add('typeDeleteInEditor', () => {
  cy.window().then((win) => {
    win.monaco.trigger('keyboard', 'deleteRight', null);
  });
});

Cypress.Commands.add('typeUndoInEditor', () => {
  const isMac = Cypress.platform === 'darwin';
  const text = isMac ? '{cmd}z' : '{ctrl}z';

  cy.get('.monaco-editor').type(text);
});

Cypress.Commands.add('typeRedoInEditor', () => {
  const isMac = Cypress.platform === 'darwin';
  const text = isMac ? '{cmd}{shift}z' : '{ctrl}{shift}z';

  cy.get('.monaco-editor').type(text);
});

Cypress.Commands.add('selectAllEditorText', () => {
  const isMac = Cypress.platform === 'darwin';
  const text = isMac ? '{meta}a' : '{ctrl}a';

  cy.focusEditorText();
  cy.get('.monaco-editor').type(text);
});

Cypress.Commands.add('getAllEditorText', () => {
  return cy.window().then((win) => {
    return win.monaco.getModel().getValue();
  });
});

Cypress.Commands.add('resolveEditorDocument', () => {
  cy.window().then((win) => {
    win.monaco.trigger('keyboard', 'swagger.editor.apidomDereference', null);
  });
});

Cypress.Commands.add('scrollToEditorLine', (lineNumber) => {
  cy.window().then((win) => {
    win.monaco.revealLine(lineNumber);
  });
});

Cypress.Commands.add('selectIsEditorReadOnly', () => {
  cy.window().then((win) => {
    return win.monaco.getRawOptions().readOnly;
  });
});

Cypress.Commands.add('pasteToEditor', (text) => {
  cy.get('.monaco-editor').paste(text);
});

Cypress.Commands.add('paste', { prevSubject: true, element: true }, ($element, data) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData('text', data);
  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    data,
    clipboardData,
  });

  $element[0].dispatchEvent(pasteEvent);
});
