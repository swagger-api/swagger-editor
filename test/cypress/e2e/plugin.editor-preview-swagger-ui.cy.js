describe('Editor Preview Pane: OpenAPI 2.0, 3.0.x, 3.1.x', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();
  });

  it('should display OpenAPI 2.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 2.0 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 2.0 Petstore').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore 2.0').should('be.visible');
    cy.get('.version-stamp > .version')
      .should('be.visible')
      .contains('OAS 2.0')
      .should('be.visible');
  });

  it('should display OpenAPI 3.0.x', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 3.0 Petstore').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.0').should('be.visible');
    cy.get('.version-stamp > .version')
      .should('be.visible')
      .contains('OAS 3.0')
      .should('be.visible');
  });

  it('should display OpenAPI 3.1.0', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.1 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 3.1 Petstore').click();

    // `.title` and `.version-stamp` are SwaggerUI specific css classes, that should only appear in the preview pane
    cy.get('.title').contains('Swagger Petstore - OpenAPI 3.1').should('be.visible');
    cy.get('.version-stamp > .version')
      .should('be.visible')
      .contains('OAS 3.1')
      .should('be.visible');
  });

  it('should be hidden if not OpenAPI', () => {
    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('AsyncAPI 2.6 Petstore').trigger('mousemove');
    cy.contains('AsyncAPI 2.6 Petstore').click();

    // `.title` is a SwaggerUI specific css class
    cy.get('.title').should('not.exist');
    cy.get('Swagger Petstore').should('not.exist');
  });
});

describe('Editor Preview Pane: JumpToPath for Schemas', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();

    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 3.0 Petstore').click();
  });

  it('should scroll the editor to the correct path for schemas', () => {
    cy.get('.view-lines.monaco-mouse-cursor-text > div > span > span')
      .contains('Order')
      .should('not.exist');
    cy.get('div[id="model-Order"]').find('.models-jump-to-path span').as('jumpToPath');
    cy.get('@jumpToPath').scrollIntoView();
    cy.get('@jumpToPath').should('be.visible');
    cy.get('@jumpToPath').click({ force: true });
    cy.get('.view-lines.monaco-mouse-cursor-text > div > span > span')
      .contains('Order', { timeout: 10000 })
      .should('exist');
  });
});

describe('Editor Preview Pane: JumpToPath for security definitions', () => {
  beforeEach(() => {
    cy.visitBlankPage();
    cy.prepareAsyncAPI();
    cy.prepareOasGenerator();
    cy.waitForSplashScreen();

    cy.contains('File').click();
    cy.contains('Load Example').trigger('mouseover');
    cy.contains('OpenAPI 3.0 Petstore').trigger('mousemove');
    cy.contains('OpenAPI 3.0 Petstore').click();
  });

  it('should close the authorization popup', () => {
    cy.get('button').contains('Authorize').click();
    cy.get('.modal-ux').should('exist');
    cy.get('.auth-container').first().find('.view-line-link').parent().as('jumpToPath');
    cy.get('@jumpToPath').scrollIntoView();
    cy.get('@jumpToPath').should('be.visible');
    cy.get('@jumpToPath').click({ force: true });
    cy.get('.modal-ux', { timeout: 10000 }).should('not.exist');
  });

  it('should scroll the editor to the correct path for security definitions', () => {
    cy.get('.view-lines.monaco-mouse-cursor-text > div > span > span')
      .contains('petstore_auth')
      .should('not.exist');
    cy.get('button').contains('Authorize').click();
    cy.get('.auth-container').first().find('.view-line-link').parent().as('jumpToPath');
    cy.get('@jumpToPath').scrollIntoView();
    cy.get('@jumpToPath').should('be.visible');
    cy.get('@jumpToPath').click({ force: true });
    cy.get('.view-lines.monaco-mouse-cursor-text > div > span > span')
      .contains('petstore_auth', { timeout: 10000 })
      .should('exist');
  });
});
