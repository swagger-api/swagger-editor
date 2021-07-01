describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    cy.get(':nth-child(2) > .dd-menu > .menu-item').should('contain', 'File');
    // testing-library version
    cy.findByText('File').should('exist');
  });
});
