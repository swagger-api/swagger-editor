describe('Editor Preview Pane: AsyncAPI 2.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();
  });
  it('displays AsyncAPI 2.x.x', () => {
    cy.contains('Edit').click();
    cy.contains('Load AsyncAPI 2.4 Streetlights Fixture').trigger('mousemove').click();
    cy.get('#check-out-its-awesome-features').should('be.visible');
    cy.get('#servers').should('be.visible');
  });
  it('hidden if not AsyncAPI 2.x.x', () => {
    cy.contains('Edit').click();
    cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
    cy.get('#check-out-its-awesome-features').should('not.exist');
    cy.get('#servers').should('not.exist');
  });
});
