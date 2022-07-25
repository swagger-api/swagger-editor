describe('Dropzone in Layout', () => {
  describe('file uploads with dropzone', () => {
    beforeEach(() => {
      cy.visitBlankPage();
      cy.prepareAsyncAPI();
      cy.waitForSplashScreen();
    });

    describe('when more than one file of an expected type is dropped', () => {
      it('should inform the user that their file(s) were rejected', () => {
        cy.get('[data-cy="dropzone"]')
          .attachFile(['petstore-oas3.yaml', 'petstore-oas3.yaml'], { subjectType: 'input' })
          .then(() => {
            cy.get('.modal-title')
              .should('contains.text', 'Uh oh, an error has occurred')
              .get('.modal-body > div')
              .should('contains.text', 'Sorry, there was an error processing your file');
          });
      });
    });

    describe('when one file of an expected type is dropped', () => {
      it('should update the EditorPane and the EditorPreviewPane', () => {
        /**
         * subjectType: 'drag-n-drop' doesn't work correctly as it generates
         * `dragleave` and then `dragenter` events (in that order), which manifests in always
         * seeing the dropzone overlay. The goal of this test is to see when the
         * file is uploaded that the editor content and rendered UI changes and
         * this goal is satisfied.
         */

        cy.get('[data-cy="dropzone"]').attachFile('petstore-oas3.yaml', {
          subjectType: 'input',
        });
        // This assertion assumes change from non-OAS3 to OAS3, where a "badge" will exist for OAS3
        cy.get('.version-stamp > .version').should('have.text', 'OAS3');
      });
    });
  });
});
