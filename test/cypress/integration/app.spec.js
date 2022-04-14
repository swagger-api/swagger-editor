/* eslint-disable testing-library/await-async-utils */
/* eslint-disable testing-library/await-async-query */

/**
 * disable above rules to cover cy.wait, cy.findByText
 * where using async/await withing Cypress is discouraged
 * this is a linting compatibility mismatch between testing-library and Cypress
 */

describe('App', () => {
  beforeEach(() => {
    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in cy support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });
    cy.prepareAsyncAPI();
  });

  it('renders the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    // eslint-disable-next-line testing-library/prefer-screen-queries
    cy.findByText('File').should('exist');
  });
});
