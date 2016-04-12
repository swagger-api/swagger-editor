'use strict';

require('json-formatter-js'); // exposes global
var JSONSchemaView = require('json-schema-view-js');

SwaggerEditor.directive('schemaModel', function() {
  return {
    templateUrl: 'templates/schema-model.html',
    restrict: 'E',
    replace: true,
    scope: {
      schema: '='
    },

    link: function postLink($scope, $element) {
      $scope.mode = 'schema';

      $scope.switchMode = function() {
        $scope.mode = $scope.mode === 'json' ? 'schema' : 'json';
      };

      /* global JSONFormatter:false*/
      var render = function() {
        var formatter = new JSONFormatter($scope.schema, 1);
        $element.find('td.view.json').html(formatter.render());

        var schemaView = new JSONSchemaView($scope.schema, 1);
        $element.find('td.view.schema').html(schemaView.render());
      };

      $scope.$watch('schema', render);

      render();
    }
  };
});
