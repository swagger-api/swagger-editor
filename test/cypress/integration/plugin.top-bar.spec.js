describe('Topbar', () => {
  beforeEach(() => {
    cy.prepareAsyncAPI();
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
  });
});
