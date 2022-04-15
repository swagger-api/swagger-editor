describe('Topbar', () => {
  beforeEach(() => {
    cy.prepareAsyncAPI();
  });

  describe('File Dropdown Menu', () => {
    it('properly loads YAML from URL', () => {
      cy.contains('File').click(); // File Menu
      cy.contains('Import URL')
        .trigger('mousemove')
        .click()
        .get('#input-import-url')
        .type(
          'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml'
        )
        .get('.btn-primary')
        .click();
      cy.get('.view-lines > :nth-child(1)')
        .should('not.have.text', '|') // applies to both OpenAPI and AsyncAPI cases if yaml improperly loaded
        .should('contains.text', 'asyncapi');
    });
  });

  describe('Editor Dropdown Menu', () => {
    it('properly "Reset Editor" and loads YAML from initial URL', () => {
      cy.contains('Editor').click();
      cy.contains('Clear Editor').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)').should('not.have.text', 'asyncapi');
      cy.contains('Editor').click();
      cy.contains('Reset Editor').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)')
        .should('not.have.text', '|') // applies to both OpenAPI and AsyncAPI cases if yaml improperly loaded
        .should('contains.text', 'asyncapi');
    });
  });
});
