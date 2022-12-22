describe('Editor Preview Pane: AsyncAPI 2.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('displays AsyncAPI 2.x.x', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('AsyncAPI 2.5 Streetlights').trigger('mousemove').click();

    cy.get('#check-out-its-awesome-features').should('be.visible');
    cy.get('#servers').should('be.visible');
  });

  it('hidden if not AsyncAPI 2.x.x', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

    cy.get('#check-out-its-awesome-features').should('not.exist');
    cy.get('#servers').should('not.exist');
  });
});
