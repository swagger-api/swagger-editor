/* eslint-disable testing-library/await-async-utils */

/**
 * disable above rules to cover cy.wait, cy.findByText
 * where using async/await withing Cypress is discouraged
 * this is a linting compatibility mismatch between testing-library and Cypress
 */

const selectAllKeys = ['darwin', 'linux'].includes(Cypress.platform) ? '{cmd}a' : '{ctrl}a';

describe.skip('Monaco Editor with Parser', () => {
  beforeEach(() => {
    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in cy support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });
    cy.prepareAsyncAPI();
  });

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
