describe('Editor Preview Pane: AsyncAPI 2.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('displays API Design Systems', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('API Design Systems').trigger('mousemove').click();

    cy.get('.title').contains('SmartBear API Guidelines').should('be.visible');
    cy.get('.version-stamp > .version').should('be.visible').contains('ADS').should('be.visible');
  });

  it('hidden if not API Design Systems', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

    cy.get('.title').contains('SmartBear API Guidelines').should('not.exist');
    cy.get('.version-stamp > .version').find('ADS').should('not.exist');
  });
});
