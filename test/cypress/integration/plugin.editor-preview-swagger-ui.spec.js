describe('Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('should display OpenAPI 2.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore 2.0').should('be.visible');
    cy.get('.version-stamp > .version').should('not.exist');
  });

  it('should display OpenAPI 3.0.x', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.0').should('be.visible');
    cy.get('.version-stamp > .version')
      .should('be.visible')
      .contains('OAS 3.0')
      .should('be.visible');
  });

  it('should display OpenAPI 3.1.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.1').should('be.visible');
    cy.get('.version-stamp > .version')
      .should('be.visible')
      .contains('OAS 3.1')
      .should('be.visible');
  });

  it('should be hidden if not OpenAPI', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('AsyncAPI 2.6 Petstore').trigger('mousemove').click();

    // `.title` is a SwaggerUI specific css class
    cy.get('.title').should('not.exist');
    cy.get('Swagger Petstore').should('not.exist');
  });
});
