describe('read only', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });
  it('should toggle between allow-write and read-only', () => {
    // default allow-write
    cy.get(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-unlock').should(
      'be.visible'
    );
    cy.selectIsEditorReadOnly().should('equal', false);
    // toggle to read-only
    cy.get(':nth-child(1) > .swagger-editor__editor-pane-bar-control').click();
    cy.get(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-lock').should(
      'be.visible'
    );
    cy.selectIsEditorReadOnly().should('equal', true);
    // toggle back to allow-write
    cy.get(':nth-child(1) > .swagger-editor__editor-pane-bar-control').click();
    cy.get(':nth-child(1) > .swagger-editor__editor-pane-bar-control > .octicon-unlock').should(
      'be.visible'
    );
    cy.selectIsEditorReadOnly().should('equal', false);
  });
});
