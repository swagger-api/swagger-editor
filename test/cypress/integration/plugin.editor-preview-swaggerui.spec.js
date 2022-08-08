describe('Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();
  });
  it('displays OAS2.0.x', () => {
    cy.contains('Edit').click();
    cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore 2.0').should('be.visible');
    cy.get('.version-stamp > .version').should('not.exist');
  });
  it('displays OAS3.0.x', () => {
    cy.contains('Edit').click();
    cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.0').should('be.visible');
    cy.get('.version-stamp > .version').should('be.visible').contains('OAS3').should('be.visible');
  });
  it('displays OAS3.1.x fallback', () => {
    cy.contains('Edit').click();
    cy.contains('Load OpenAPI 3.1 Fixture').trigger('mousemove').click();
    // `.version-pragma__message` is a SwaggerEditor specific css class, that should only appear in the preview pane
    cy.get('.version-pragma__message h3')
      .contains('Unable to render editor content')
      .should('be.visible');
    cy.get('.version-pragma__message > div')
      .contains('SwaggerUI does not currently support rendering of OpenAPI 3.1 definitions')
      .should('be.visible');
  });
  it('hidden if not OAS2.0, OAS3.0.x, or OAS3.1', () => {
    cy.contains('Edit').click();
    cy.contains('Load AsyncAPI 2.4 Streetlights Fixture').trigger('mousemove').click();
    // `.title` is a SwaggerUI specific css class
    cy.get('.title').should('not.exist');
    cy.get('Swagger Petstore').should('not.exist');
  });
});
