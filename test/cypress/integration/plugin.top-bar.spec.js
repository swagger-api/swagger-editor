describe('Topbar', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.waitForSplashScreen();
  });

  describe('File Dropdown Menu', () => {
    it('should load file from URL', () => {
      cy.contains('File').click(); // File Menu
      cy.contains('Import URL')
        .trigger('mousemove')
        .click()
        .get('#input-import-url')
        .type(
          'https://raw.githubusercontent.com/asyncapi/spec/v2.4.0/examples/streetlights-kafka.yml'
        )
        .get('.btn-primary')
        .click();
      cy.get('.view-lines > :nth-child(1)')
        .should('not.have.text', '|') // applies to both OpenAPI and AsyncAPI cases if yaml improperly loaded
        .should('contains.text', 'asyncapi');
    });
  });

  describe('Edit Dropdown Menu', () => {
    it('should clear editor', () => {
      cy.contains('Edit').click();
      cy.contains('Clear').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)').should('to.have.text', '');
    });
    it('should be able to Load a fixture as YAML', () => {
      /**
       * Fixtures are JSON
       * YAML option is progammatically set per menu item
       */
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 3.0 Fixture').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)')
        .should('contains.text', 'openapi')
        .should('not.have.text', '{')
        .should('not.have.text', '"');
    });
    it('should be able to Load a fixture as JSON', () => {
      /**
       * Final production version might not contain
       * a fixture that we intend to load as JSON.
       * If so, please disable this test
       */
      cy.contains('Edit').click();
      cy.contains('Load AsyncAPI 2.4 Petstore Fixture').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)').should('contains.text', '{');
      cy.get('.view-lines > :nth-child(2)').should('contains.text', '"asyncapi"'); // note the double quotes
    });
  });
});
