'use strict';

PhonicsApp.controller('SecurityCtrl', function SecurityCtrl($scope, $modal) {
  $scope.getHumanSecurityType = function (type) {
    var types = {
      basic: 'HTTP Basic Authentication',
      oauth2: 'OAuth 2.0',
      apiKey: 'API Key'
    };

    return types[type];
  };

  $scope.authenticate = function (security) {
    if (security.type === 'basic') {
      $modal.open({
        templateUrl: 'templates/auth/basic.html',
        controller: function BasicAuthAuthenticateCtrl($scope, $modalInstance) {
          $scope.cancel = $modalInstance.close;
          $scope.authenticate = function () {
            console.log($scope.username, $scope.password);
          };
        },
        size: 'large',
        resolve: {
          data:  function () { return security; }
        }
      });
    } else {
      window.alert('Not yet supported');
    }
  };
});
