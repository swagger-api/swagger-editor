describe('Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('displays OpenAPI 2.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore 2.0').should('be.visible');
    cy.get('.version-stamp > .version').should('not.exist');
  });

  it('displays OpenAPI 3.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.0').should('be.visible');
    cy.get('.version-stamp > .version').should('be.visible').contains('OAS3').should('be.visible');
  });

  it('displays OpenAPI 3.1 fallback', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();

    // `.version-pragma__message` is a SwaggerEditor specific css class, that should only appear in the preview pane
    cy.get('.version-pragma__message h3')
      .contains('Unable to render editor content')
      .should('be.visible');
    cy.get('.version-pragma__message > div')
      .contains('SwaggerUI does not currently support rendering of OpenAPI 3.1 definitions')
      .should('be.visible');
  });

  it('should be hidden if not OpenAPI', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('AsyncAPI 2.5 Petstore').trigger('mousemove').click();

    // `.title` is a SwaggerUI specific css class
    cy.get('.title').should('not.exist');
    cy.get('Swagger Petstore').should('not.exist');
  });
});
