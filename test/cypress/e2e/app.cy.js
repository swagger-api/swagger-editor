describe('App', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.visit('/');
    cy.waitForSplashScreen();
  });

  it('should render the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    // eslint-disable-next-line testing-library/prefer-screen-queries
    cy.findByText('File').should('exist');
  });
});

describe('App: queryConfigEnabled', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareOasGenerator();
  });

  it('should load the URL passed through the query', () => {
    cy.prepareOpenAPI30x();
    cy.waitForSplashScreen();

    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.0').should('exist');
  });

  it('should apply filter passed through the query', () => {
    cy.visit('/?filter=user');
    cy.waitForSplashScreen();

    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 3.0 Petstore').click();

    cy.get('.opblock-tag').contains('user').should('exist');
    cy.get('.opblock-tag').contains('pet').should('not.exist');
  });
});
