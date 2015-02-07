'use strict';

/*
 * This test file just opens the web app and examine if
 * there is store the security map
 * It marks tests success if there is
 */

function setValue(value) {
  browser.executeScript(function (value) {
    document.querySelector('[ui-ace]').env.editor.setValue(value);
  }, value);
}

describe('Session auth tests', function () {
  it('Should find the sessionStorage', function () {
    var swyaml = [
        'swagger: \'2.0\'',
        'info:',
        '  version: 1.0.9-abcd',
        '  title: Swagger Sample API',
        'basePath: /v1',
        'schemes:',
        '  - http',
        '  - https',
        'security:',
        '  - githubAccessCode:',
        '    - user',
        '    - user:email',
        '  - petstoreImplicit:',
        '    - user',
        '    - user:email',
        '  - internalApiKey: []',
        'paths:',
        '  /pets/{id}:',
        '    get:',
        '      parameters:',
        '      - name: id',
        '        in: path',
        '        description: ID of pet to use',
        '        required: true',
        '        type: array',
        '        items:',
        '          type: string',
        '        collectionFormat: csv',
        '      description: Returns pets based on ID',
        '      summary: Find pets by ID',
        '      operationId: getPetsById',
        '      security:',
        '        - githubAccessCode:',
        '            - user',
        '        - internalApiKey: []',
        '      responses:',
        '        default:',
        '          description: error payload',
        '          schema:',
        '            $ref: \'#/definitions/ErrorModel\'',
        'securityDefinitions:',
        '  githubAccessCode:',
        '    type: oauth2',
        '    scopes:',
        '      user: Grants read/write .',
        '      user:email: Grants read .',
        '    flow: accessCode',
        '    authorizationUrl: https://github.com/login/oauth/authorize',
        '    tokenUrl: https://github.com/login/oauth/access_token',
        '  petstoreImplicit:',
        '    type: oauth2',
        '    scopes:',
        '      user: Grants read/write .',
        '      user:email: Grants read .',
        '    flow: implicit',
        '    authorizationUrl: http://domain.com/oauth/dialog',
        '  internalApiKey:',
        '    type: apiKey',
        '    in: header',
        '    name: api_key',
        'definitions:',
        '  ErrorModel:',
        '    required:',
        '      - code',
        '      - message',
        '    properties:',
        '      code:',
        '        type: integer',
        '        format: int32',
        '      message:',
        '        type: string'
    ].join('\n');

    //swyaml is the test yaml file

    setValue(swyaml);

    browser.sleep(3000);

    browser.executeAsyncScript(function (done) {
      var auth = JSON.stringify(window.sessionStorage);
      done(auth);
    }).then(function (auth) {
      var sessionStorage = JSON.parse(auth);
      var storeAuth = JSON.parse(
        sessionStorage['ngStorage-securityKeys']
      );

      expect(storeAuth.hasOwnProperty('githubAccessCode'))
      .toEqual(true);
      expect(storeAuth.hasOwnProperty('petstoreImplicit'))
      .toEqual(true);
      expect(storeAuth.hasOwnProperty('internalApiKey'))
      .toEqual(true);
      expect(storeAuth.hasOwnProperty('anynotfound'))
      .toEqual(false);
    });
  });
});
