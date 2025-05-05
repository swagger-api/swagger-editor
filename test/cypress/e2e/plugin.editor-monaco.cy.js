describe('Monaco Editor with Parser', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.window().then((contentWindow) => {
      // console.log already globally stubbed in cy support/commands
      cy.spy(contentWindow.console, 'error').as('consoleError');
    });
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('should not throw console.error when parsing empty string', () => {
    cy.selectAllEditorText();
    cy.typeBackspaceInEditor();

    cy.waitForContentPropagation();

    cy.get('@consoleError').should('not.be.called');
    cy.get('.monaco-editor .view-lines').should('contains.text', '');
  });

  it('should not throw console.error when parsing unsupported definition', () => {
    cy.selectAllEditorText();
    cy.typeInEditor('randomapi: 1.0.0\n');

    cy.waitForContentPropagation();

    cy.get('@consoleError').should('not.be.called');
    cy.get('.monaco-editor .view-lines').should('contains.text', 'randomapi');
  });

  it('should toggle between light and dark themes', () => {
    // default dark
    cy.get(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-sun').should(
      'be.visible'
    );
    cy.get('.swagger-editor__editor-monaco > .vs-dark ').should('exist');
    // toggle to light
    cy.get(':nth-child(2) > .swagger-editor__editor-pane-bar-control').click();
    cy.get(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-moon').should(
      'be.visible'
    );
    cy.get('.swagger-editor__editor-monaco > .vs ').should('exist');
    // toggle back to dark
    cy.get(':nth-child(2) > .swagger-editor__editor-pane-bar-control').click();
    cy.get(':nth-child(2) > .swagger-editor__editor-pane-bar-control > .octicon-sun').should(
      'be.visible'
    );
    cy.get('.swagger-editor__editor-monaco > .vs-dark ').should('exist');
  });
});
