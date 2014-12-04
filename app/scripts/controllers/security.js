'use strict';

PhonicsApp.controller('SecurityCtrl', function SecurityCtrl($scope, $modal,
  AuthManager) {
  $scope.getHumanSecurityType = function (type) {
    var types = {
      basic: 'HTTP Basic Authentication',
      oauth2: 'OAuth 2.0',
      apiKey: 'API Key'
    };

    return types[type];
  };

  $scope.isAuthenticated = function (security) {
    var auth = AuthManager.getAuth(security);

    return auth && auth.isAuthenticated;
  };

  $scope.authenticate = function (security) {
    if (security.type === 'basic') {
      $modal.open({
        templateUrl: 'templates/auth/basic.html',
        controller: function BasicAuthAuthenticateCtrl($scope, $modalInstance) {
          $scope.cancel = $modalInstance.close;
          $scope.authenticate = function () {
            AuthManager.basicAuth(security, {
              username: $scope.username,
              password: $scope.password
            });
            $modalInstance.close();
          };
        },
        size: 'large'
      });
    } else {
      window.alert('Not yet supported');
    }
  };
});
