describe('App', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.visit('/');
    cy.waitForSplashScreen();
  });

  it('should render the app', () => {
    // dev: picking a random element that should display, in this case the 'File' menu dropdown
    // eslint-disable-next-line testing-library/prefer-screen-queries
    cy.findByText('File').should('exist');
  });
});
