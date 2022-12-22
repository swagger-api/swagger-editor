describe('Topbar', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  describe('File Dropdown Menu', () => {
    it('should load file from URL', () => {
      cy.contains('File').click(); // File Menu
      cy.contains('Import URL')
        .trigger('mousemove')
        .click()
        .get('#input-import-url')
        .type(
          'https://raw.githubusercontent.com/asyncapi/spec/v2.5.0/examples/streetlights-kafka.yml'
        )
        .get('.btn-primary')
        .click();
      cy.get('.view-lines > :nth-child(1)')
        .should('not.have.text', '|') // applies to both OpenAPI and AsyncAPI cases if yaml improperly loaded
        .should('contains.text', 'asyncapi');
    });

    it('should render "Import File" menu item', () => {
      cy.contains('File').click(); // File Menu
      cy.contains('Import File').should('exist');
    });

    it('should "Import File" and display rendered changes', () => {
      /**
       * Cypress does not handle native events like opening a File Dialog.
       * The goal of this test is to see when the file is uploaded that the
       * editor content and rendered UI changes.
       * In this test, it is not required for Cypress to "interact" with the
       * "File" Menu or the "Import File" menu item. If "interact" occurs
       * with "Import File", test runner will output console warning:
       * "File chooser dialog can only be shown with a user activation."
       */
      cy.get('input[type=file]').attachFile('petstore-oas3.yaml', {
        subjectType: 'input',
      });
      cy.wait(['@externalGeneratorServersOas3reqList', '@externalGeneratorClientsOas3reqList']);
      // This assertion assumes change from non-OAS3 to OAS3, where a "badge" will exist for OAS3
      cy.get('.version-stamp > .version').should('have.text', 'OAS3');
    });

    describe('Load Example nested menu', () => {
      it('should load OpenAPI 3.1 Petstore example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', '3.1.0')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });

      it('should load OpenAPI 3.0 Petstore example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', '3.0.3')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });

      it('should load OpenAPI 2.0 Petstore example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', 'swagger')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });

      it('should load AsyncAPI 2.5 Petstore example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('AsyncAPI 2.5 Petstore').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(3)')
          .should('contains.text', 'Petstore')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });

      it('should load AsyncAPI 2.5 Streetlights example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('AsyncAPI 2.5 Streetlights').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(3)')
          .should('contains.text', 'Streetlights')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });

      it('should load API Design Systems example as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('API Design Systems').trigger('mousemove').click();

        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', '2021-05-07')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });
    });

    describe('when content is JSON', () => {
      /**
       * vs. Edit Menu, operation also will initiate a file download without additional user input
       * Final production version might not contain
       * a fixture that we intend to load and display as JSON.
       * So here we assume that we can load a fixture as YAML,
       * then convert to JSON.
       * Then assert expected File Menu item is displayed,
       * However, no additional assertion for click event or download event
       * unless we want to check for file existence and/or file contents
       */
      it('should render clickable text: "Save (as JSON)', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').trigger('mousemove').click();
        cy.contains('File').click();
        cy.contains('Save (as JSON)').should('exist');
      });

      it('should render clickable text: "Convert and Save as YAML', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').trigger('mousemove').click();
        cy.contains('File').click();
        cy.contains('Convert and Save as YAML').should('exist');
      });
    });

    describe('when content is YAML', () => {
      /**
       * vs. Edit Menu, operation also will initiate a file download without additional user input
       * Here we assume that we can load a fixture as YAML.
       * Then assert expected File Menu item is displayed,
       * However, no additional assertion for click event or download event
       * unless we want to check for file existence and/or file contents
       */
      it('should render clickable text: "Save (as YAML)', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();
        cy.contains('File').click();
        cy.contains('Save (as YAML)').should('exist');
      });

      it('should render clickable text: "Convert and Save as JSON', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
        cy.contains('File').click();
        cy.contains('Convert and Save as JSON').should('exist');
      });
    });
  });

  describe('Edit Dropdown Menu', () => {
    it('should clear editor', () => {
      cy.contains('Edit').click();
      cy.contains('Clear').trigger('mousemove').click();
      cy.get('.view-lines > :nth-child(1)').should('to.have.text', '');
    });

    describe('given editor content is in YAML format', () => {
      it('displays "Convert To JSON" menu item', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();

        cy.contains('Convert to JSON').should('be.visible');
      });
    });

    describe('given editor content is in JSON format', () => {
      it('displays "Convert To YAML" menu item', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').trigger('mousemove').click();
        cy.contains('Edit').click();

        cy.contains('Convert to YAML').should('be.visible');
      });
    });

    describe('"Convert to OpenAPI 3.0.x" menu item', () => {
      it('displays "Convert to OpenAPI 3.0.x" after loading OpenAPI 2.0 fixture', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();

        cy.contains('Convert to OpenAPI 3.0.x').should('be.visible');
      });

      it('should not display "Convert to OpenAPI 3.0.x" after loading OpenAPI 3.0 fixture', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();

        cy.get('Convert to OpenAPI 3.0.x').should('not.exist');
      });

      it('should not display "Convert to OpenAPI 3.0.x" after loading AsyncAPI 2.5 fixture', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('AsyncAPI 2.5 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();

        cy.get('Convert to OpenAPI 3.0.x').should('not.exist');
      });

      it('should call external http service to "Convert to OpenAPI 3.0.x" after loading OpenAPI 2.0 fixture', () => {
        cy.contains('File').click();
        cy.contains('Load Example').trigger('mouseover');
        cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to OpenAPI 3.0.x')
          .should('be.visible')
          .trigger('mousemove')
          .click()
          .wait('@externalConverterToOas3');
        // This assertion assumes change from non-OAS3 to OAS3, where a "badge" will exist for OAS3
        cy.get('.version-stamp > .version').should('have.text', 'OAS3');
      });
    });
  });

  describe('Generator Dropdown Menu(s)', () => {
    /**
     * By default, any "Generate Server" or "Generate Client" list
     * is retrieved via an http service
     * Clicking on a specific menu item from one of these lists
     * will auto-download a generated file via an http service
     * without further user action required
     */
    beforeEach(() => {
      cy.clearDownloadsFolder();
    });
    after(() => {
      cy.clearDownloadsFolder();
    });

    const downloadsFolder = Cypress.config('downloadsFolder'); // use default setting

    it('should render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 2.0', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();

      cy.contains('Generate Server').should('be.visible');
      cy.contains('Generate Client').should('be.visible');
    });

    it('should render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 3.0', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();

      cy.contains('Generate Server').should('be.visible');
      cy.contains('Generate Client').should('be.visible');
    });

    it('should NOT render "Generate Server" and "Generate Client" dropdown menus when OpenAPI 3.1', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove').click();

      cy.get('Generate Server').should('not.exist');
      cy.get('Generate Client').should('not.exist');
    });

    it('should NOT render "Generate Server" and "Generate Client" dropdown menus when AsyncAPI 2.5', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('AsyncAPI 2.5 Petstore').trigger('mousemove').click();

      cy.get('Generate Server').should('not.exist');
      cy.get('Generate Client').should('not.exist');
    });

    it('should download a generated OpenAPI 3.0 Server file', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
      cy.contains('Generate Server').should('be.visible').click();
      cy.contains('blue') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorOas3Download')
        .readFile(`${downloadsFolder}/blue-server-generated.zip`)
        .should('exist');
    });

    it('should download a generated OpenAPI 3.0 Client file', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove').click();
      cy.contains('Generate Client').should('be.visible').click();
      cy.contains('apple') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorOas3Download')
        .readFile(`${downloadsFolder}/apple-client-generated.zip`)
        .should('exist');
    });

    it('should download a generated OpenAPI 2.0 Server file', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();
      cy.contains('Generate Server').should('be.visible').click();
      cy.contains('blue') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorServersOAS2reqDownloadUrl')
        .wait('@externalGeneratorOas2Download')
        .readFile(`${downloadsFolder}/blue-server-generated.zip`)
        .should('exist');
    });

    it('should download a generated OpenAPI 2.0 Client file', () => {
      cy.contains('File').click();
      cy.contains('Load Example').trigger('mouseover');
      cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove').click();
      cy.contains('Generate Client').should('be.visible').click();
      cy.contains('apple') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorClientsOAS2reqDownloadUrl')
        .wait('@externalGeneratorOas2Download')
        .readFile(`${downloadsFolder}/apple-client-generated.zip`)
        .should('exist');
    });
  });

  describe('About Drop Menu', () => {
    it('should have expect menu items', () => {
      cy.contains('About').click(); // About Menu
      cy.contains('About Swagger Editor').should('exist');
      cy.contains('View Docs').should('exist');
      cy.contains('View on GitHub').should('exist');
    });
  });
});
