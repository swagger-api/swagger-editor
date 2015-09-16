'use strict';

SwaggerEditor.directive('schemaModel', function () {

  return {
    templateUrl: 'templates/schema-model.html',
    restrict: 'E',
    replace: true,
    scope: {
      schema: '='
    },

    link: function postLink($scope, $element) {
      $scope.mode = 'schema';

      $scope.switchMode = function () {
        $scope.mode = $scope.mode === 'json' ? 'schema' : 'json';
      };

      $scope.$watch('schema', render);

      render();

      function render() {
        var formatter = new JSONFormatter($scope.schema, 1);
        $element.find('td.view.json').html(formatter.render());

        var schemaView = new JSONSchemaView($scope.schema, 1);
        $element.find('td.view.schema').html(schemaView.render());
      }
    }
  };
});
