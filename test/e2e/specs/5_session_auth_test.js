'use strict';

/*
 * This test file just opens the web app and examine if
 * there is store the security map
 * It marks tests success if there is
 */

var fs = require('fs');
var path = require('path');
var yamlPath = path.join(__dirname, './session.yaml');
var swyaml = fs.readFileSync(yamlPath).toString();

var setValue = function(value) {
  browser.executeScript(function(value) {
    document.querySelector('[ui-ace]').env.editor.setValue(value);
  }, value);
  browser.sleep(1000);
};

describe('Session auth tests', function() {
  beforeEach(function() {
    browser.executeAsyncScript(function(done) {
      window.sessionStorage.clear();
      done();
    });
  });

  // Fix tests (to do)
  it('Should find the sessionStorage', function() {
    // swyaml is the test yaml file
    setValue(swyaml);
    browser.executeScript(function() {
      return JSON.parse(
        window.sessionStorage.getItem('ngStorage-securityKeys')
      );
    }).then(function(storeAuth) {
      expect(storeAuth.hasOwnProperty('githubAccessCode')).toEqual(true);
      expect(storeAuth.hasOwnProperty('petstoreImplicit')).toEqual(true);
      expect(storeAuth.hasOwnProperty('internalApiKey')).toEqual(true);
      expect(storeAuth.hasOwnProperty('anynotfound')).toEqual(false);
    });
  });
});
