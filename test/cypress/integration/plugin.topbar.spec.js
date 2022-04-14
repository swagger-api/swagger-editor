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
        .should('not.have.text', '|') // applies to both OpenAPI and AsyncAPI cases
        .should('contains.text', 'asyncapi');
    });
  });
});
