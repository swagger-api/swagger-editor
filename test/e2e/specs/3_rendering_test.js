'use strict';

/*
 * Test rendering behavior
*/

describe('Rendering', function() {
  var elements = [
    ['Main Header', '.main-header'],
    ['File Menu', '[ng-if="showFileMenu()"]'],
    ['Preview Pane', '.preview-wrapper'],
    ['Info Container', '.info-container'],
    ['Paths', '.preview-wrapper ul.paths'],
    ['At least a path', '.path'],
    ['At least an operation', '.operation'],
    ['At least a parameter', '.params'],
    ['Models', '[ng-if="specs.definitions"]'],
    ['At least a model', '.schema-model']
  ];

  var expectElement = function(name, selector) {
    it('should render ' + name, function() {
      expect($(selector).isPresent()).toBe(true);
    });
  };
  elements.forEach(function(element) {
    expectElement(element[0], element[1]);
  });
});
