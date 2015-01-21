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

  $scope.isAuthenticated = AuthManager.securityIsAuthenticated;

  $scope.authenticate = function (securityName, security) {
    if (security.type === 'basic') {
      $modal.open({
        templateUrl: 'templates/auth/basic.html',
        controller: function BasicAuthAuthenticateCtrl($scope, $modalInstance) {
          $scope.cancel = $modalInstance.close;
          $scope.authenticate = function () {
            if (!$scope.username || !$scope.password) {
              return;
            }
            AuthManager.basicAuth(securityName, security, {
              username: $scope.username,
              password: $scope.password
            });
            $modalInstance.close();
          };
        },
        size: 'large'
      });
    } else if (security.type === 'oauth2') {
      $modal.open({
        templateUrl: 'templates/auth/oauth2.html',
        controller: function OAuth2AuthenticateCtrl($scope, $modalInstance) {
          $scope.cancel = $modalInstance.close;
          $scope.authenticate = function () {
            if (!$scope.accessToken) {
              return;
            }
            AuthManager.oAuth2(securityName, security, {
              accessToken: $scope.accessToken
            });
            $modalInstance.close();
          };
        },
        size: 'large'
      });
    } else if (security.type === 'apiKey') {
      $modal.open({
        templateUrl: 'templates/auth/api-key.html',
        controller: function APIKeyAuthenticateCtrl($scope, $modalInstance) {
          $scope.cancel = $modalInstance.close;
          $scope.authenticate = function () {
            if (!$scope.apiKey) {
              return;
            }
            AuthManager.oAuth2(securityName, security, {
              apiKey: $scope.apiKey
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
