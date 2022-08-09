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
          'https://raw.githubusercontent.com/asyncapi/spec/v2.4.0/examples/streetlights-kafka.yml'
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
    it.skip('should be able to click on Import file', () => {
      // Cypress does not handle native events like opening a File Dialog
      // Jest: previously existing test only asserted that method to open file dialog box was called
    });
    describe('when content is JSON', () => {
      /**
       * vs. Edit Menu, operation also will initiate a file download without additional user input
       * Final production version might not contain
       * a fixture that we intend to load and display as JSON.
       * So here we assume that we can load a fixture as YAML,
       * then convert to JSON.
       * Then assert expected File Menu item is displayed,
       * However, no additional assertion for click event
       * or download event because the converter is an http service
       */
      it('should render clickable text: "Save (as JSON)', () => {
        cy.contains('Edit').click(); // Edit Menu
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').trigger('mousemove').click();
        cy.contains('File').click(); // File Menu
        cy.contains('Save (as JSON)').should('exist');
      });
      it('should render clickable text: "Convert and Save as YAML', () => {
        cy.contains('Edit').click(); // Edit Menu
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').trigger('mousemove').click();
        cy.contains('File').click(); // File Menu
        cy.contains('Convert and Save as YAML').should('exist');
      });
    });
    describe('when content is YAML', () => {
      /**
       * vs. Edit Menu, operation also will initiate a file download without additional user input
       * Here we assume that we can load a fixture as YAML.
       * Then assert expected File Menu item is displayed,
       * However, no additional assertion for click event
       * or download event because the converter is an http service
       */
      it('should render clickable text: "Save (as YAML)', () => {
        cy.contains('Edit').click(); // Edit Menu
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('File').click(); // File Menu
        cy.contains('Save (as YAML)').should('exist');
      });
      it('should render clickable text: "Convert and Save as JSON', () => {
        cy.contains('Edit').click(); // Edit Menu
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('File').click(); // File Menu
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

    describe('should be able to Load a fixture as YAML', () => {
      /**
       * Fixtures are JSON
       * YAML option is progammatically set per menu item
       */
      it('loads OpenAPI 3.0 Petstore Fixture as YAML', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', 'openapi')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });
      it('loads OpenAPI 3.1 Fixture as YAML', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 3.1 Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', 'openapi')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });
      it('loads OpenAPI 2.0 Petstore Fixture as YAML', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', 'swagger')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });
      it('loads AsyncAPI 2.4 Streetlights Fixture as YAML', () => {
        cy.contains('Edit').click();
        cy.contains('Load AsyncAPI 2.4 Streetlights Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)')
          .should('contains.text', 'asyncapi')
          .should('not.have.text', '{')
          .should('not.have.text', '"');
      });
    });

    describe('should be able to Load a fixture as JSON', () => {
      /**
       * Final production version might not contain
       * a fixture that we intend to load and display as JSON.
       * If so, please disable these test(s)
       */
      it('loads AsyncAPI 2.4 Petstore Fixture as JSON', () => {
        cy.contains('Edit').click();
        cy.contains('Load AsyncAPI 2.4 Petstore Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)').should('contains.text', '{');
        cy.get('.view-lines > :nth-child(2)').should('contains.text', '"asyncapi"'); // note the double quotes
      });
      it('loads API Design Systems Fixture as JSON', () => {
        cy.contains('Edit').click();
        cy.contains('Load API Design Systems Fixture').trigger('mousemove').click();
        cy.get('.view-lines > :nth-child(1)').should('contains.text', '{');
      });
    });

    describe('should display "Convert To JSON" menu item after loading fixture as YAML', () => {
      it('displays "Convert To JSON" option for OpenAPI 3.0 Petstore Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').should('be.visible');
      });
      it('displays "Convert To JSON" option for OpenAPI 3.1 Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 3.1 Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').should('be.visible');
      });
      it('displays "Convert To JSON" option for OpenAPI 2.0 Petstore Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').should('be.visible');
      });
      it('displays "Convert To JSON" option for AsyncAPI Streetlights 2.4 Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load AsyncAPI 2.4 Streetlights Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to JSON').should('be.visible');
      });
    });

    describe('should display "Convert to YAML" menu item after loading fixture as JSON', () => {
      /**
       * Final production version might not contain
       * a fixture that we intend to load and display as JSON.
       * If so, please disable these tests
       */
      it('displays "Convert To YAML" option for AsyncAPI 2.4 Petstore Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load AsyncAPI 2.4 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to YAML').should('be.visible');
      });
      it('displays "Convert To YAML" option for API Design Systems Fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load API Design Systems Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to YAML').should('be.visible');
      });
    });

    describe('"Convert to OpenAPI 3.0.x" menu item', () => {
      it('displays "Convert to OpenAPI 3.0.x" after loading OAS2.0 fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.contains('Convert to OpenAPI 3.0.x').should('be.visible');
      });
      it('should not display "Convert to OpenAPI 3.0.x" after loading OAS3.x fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.get('Convert to OpenAPI 3.0.x').should('not.exist');
      });
      it('should not display "Convert to OpenAPI 3.0.x" after loading AsyncAPI 2.x fixture', () => {
        cy.contains('Edit').click();
        cy.contains('Load AsyncAPI 2.4 Petstore Fixture').trigger('mousemove').click();
        cy.contains('Edit').click();
        cy.get('Convert to OpenAPI 3.0.x').should('not.exist');
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
     * We could try mocking the return request data to assert against
     * list items, but would still need to intercept and mock download
     */
    const downloadsFolder = Cypress.config('downloadsFolder'); // use default setting

    it('should render "Generate Server" and "Generate Client" dropdown menus when OAS2.0', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
      cy.contains('Generate Server').should('be.visible');
      cy.contains('Generate Client').should('be.visible');
      /**
       * below uses an http service, hence disabling from standard test
       * also, we would be more interested in download action trigger
       * rather than the specific menu item itself or its download contents
       */
      // cy.contains('Generate Server').click();
      // cy.contains('ada-server').should('be.visible');
      // cy.contains('Generate Client').click();
      // cy.contains('ada').should('be.visible');
    });
    it('should render "Generate Server" and "Generate Client" dropdown menus when OAS3.0.x', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
      cy.contains('Generate Server').should('be.visible');
      cy.contains('Generate Client').should('be.visible');
      /**
       * below uses an http service, hence disabling from standard test
       * also, we would be more interested in download action trigger
       * rather than the specific menu item itself or its download contents
       */
      // cy.contains('Generate Server').click();
      // cy.contains('aspnetcore').should('be.visible');
      // cy.contains('Generate Client').click();
      // cy.contains('csharp').should('be.visible');
    });
    it('should NOT render "Generate Server" and "Generate Client" dropdown menus when OAS3.1', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 3.1 Fixture').trigger('mousemove').click();
      cy.get('Generate Server').should('not.exist');
      cy.get('Generate Client').should('not.exist');
    });
    it('should NOT render "Generate Server" and "Generate Client" dropdown menus when AsyncAPI2.x', () => {
      cy.contains('Edit').click();
      cy.contains('Load AsyncAPI 2.4 Streetlights Fixture').trigger('mousemove').click();
      cy.get('Generate Server').should('not.exist');
      cy.get('Generate Client').should('not.exist');
    });
    it('should download a generated OAS3.0.x Server file', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
      cy.contains('Generate Server').should('be.visible').click();
      cy.contains('blue') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorOas3Download')
        .readFile(`${downloadsFolder}/blue-server-generated.zip`)
        .should('exist');
    });
    it('should download a generated OAS3.0.x Client file', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 3.0 Petstore Fixture').trigger('mousemove').click();
      cy.contains('Generate Client').should('be.visible').click();
      cy.contains('apple') // mocked response value
        .should('be.visible')
        .trigger('mousemove')
        .click()
        .wait('@externalGeneratorOas3Download')
        .readFile(`${downloadsFolder}/apple-client-generated.zip`)
        .should('exist');
    });
    it('should download a generated OAS2.0 Server file', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
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
    it('should download a generated OAS2.0 Client file', () => {
      cy.contains('Edit').click();
      cy.contains('Load OpenAPI 2.0 Petstore Fixture').trigger('mousemove').click();
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
});
