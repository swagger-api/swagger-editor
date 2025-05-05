describe('Monaco Editor with Validation Pane', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();

    // move down to line 2, column 3
    cy.focusEditorText({ lineNumber: 2, column: 3 });
    // introduce a typo error
    cy.typeInEditor('Q');
    cy.waitForContentPropagation();
  });

  /**
   * note: future UX may make the table header <thead> always visible,
   * or existing but collapsed
   * expect table body <tbody> to always not exist if there are no errors
   * make appropriate changes if/when needed
   */
  it('should display visible Validation Pane table header and table body when error exists', () => {
    cy.get('.swagger-editor__validation-table')
      .should('exist')
      .get('.swagger-editor__validation-table > thead')
      .should('be.visible')
      .get('.swagger-editor__validation-table > tbody')
      .should('be.visible');
    // some additional assertions just to make sure
    cy.get('.swagger-editor__validation-table > thead > tr > :nth-child(1)')
      .contains('Severity', { matchCase: false })
      .should('be.visible');
    cy.get('.swagger-editor__validation-table > thead > tr > :nth-child(2)')
      .contains('Line', { matchCase: false })
      .should('be.visible');
    cy.get('.swagger-editor__validation-table > thead > tr > :nth-child(3)')
      .contains('Code', { matchCase: false })
      .should('be.visible');
    cy.get('.swagger-editor__validation-table > thead > tr > :nth-child(4)')
      .contains('Message', { matchCase: false })
      .should('be.visible');
    // reflects line number from moveToPosition for validation error
    cy.get('.swagger-editor__validation-table > tbody td:nth-child(2)')
      .contains('1')
      .should('be.visible');
    // validation error message is parser specific
    cy.get('.swagger-editor__validation-table > tbody td:nth-child(4)')
      .contains('Object must have required property "info"')
      .should('be.visible');
  });

  it('should not display Validation Pane after error is cleared', () => {
    // fix the typo error
    cy.typeBackspaceInEditor();
    // re-assert
    cy.get('.swagger-editor__validation-table > thead').should('not.exist');
    cy.get('.swagger-editor__validation-table > tbody').should('not.exist');
  });
});
