describe('EditorLocalStoragePlugin', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
      {
        fixture: 'streetlights-kafka.yml',
      }
    ).as('streetlightsKafka');

    cy.visit('/', {});
    // tests when initial URL is set to AsyncAPI streetlights-kafka.yml
    cy.wait('@streetlightsKafka').then(() => {
      // console.log('ok');
    });
  });

  it('should load definition with provided url prop', () => {
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', 'asyncapi')
      .should('contains.text', '2.2.0');
  });

  it('should reload while keeping text change from 2.2.0 to 2.1.0', () => {
    const moveToPosition = `{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}`;
    cy.get('.monaco-editor textarea:first')
      .click()
      .focused()
      .type(`${moveToPosition}{shift+rightArrow}1`);
    cy.get('.monaco-editor .view-lines').should('contains.text', '2.1.0');
    cy.reload();
    cy.get('.monaco-editor .view-lines')
      .should('contains.text', '2.1.0')
      .should('not.contains.text', '2.2.0');
  });
});
