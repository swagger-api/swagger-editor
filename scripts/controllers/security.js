'use strict';

SwaggerEditor.controller('SecurityCtrl', function SecurityCtrl($scope,
  $uibModal, AuthManager) {
  $scope.getHumanSecurityType = function(type) {
    var types = {
      basic: 'HTTP Basic Authentication',
      oauth2: 'OAuth 2.0',
      apiKey: 'API Key'
    };

    return types[type];
  };

  $scope.isAuthenticated = AuthManager.securityIsAuthenticated;

  $scope.authenticate = function(securityName, security) {
    if (security.type === 'basic') {
      $uibModal.open({
        template: require('templates/auth/basic.html'),
        controller: ['$scope', '$uibModalInstance',
        function BasicAuthAuthenticateCtrl($scope,
          $uibModalInstance) {
          $scope.cancel = $uibModalInstance.close;
          $scope.authenticate = function(username, password) {
            AuthManager.basicAuth(securityName, security, {
              username: username,
              password: password
            });
            $uibModalInstance.close();
          };
        }],
        size: 'large'
      });
    } else if (security.type === 'oauth2') {
      $uibModal.open({
        template: require('templates/auth/oauth2.html'),
        controller: ['$scope', '$uibModalInstance',
        function OAuth2AuthenticateCtrl($scope, $uibModalInstance) {
          $scope.cancel = $uibModalInstance.close;
          $scope.authenticate = function(accessToken) {
            if (!accessToken) {
              return;
            }
            AuthManager.oAuth2(securityName, security, {
              accessToken: accessToken
            });
            $uibModalInstance.close();
          };
        }],
        size: 'large'
      });
    } else if (security.type === 'apiKey') {
      $uibModal.open({
        template: require('templates/auth/api-key.html'),
        controller: ['$scope', '$uibModalInstance',
          function APIKeyAuthenticateCtrl($scope, $uibModalInstance) {
            $scope.cancel = $uibModalInstance.close;
            $scope.authenticate = function(apiKey) {
              if (!apiKey) {
                return;
              }
              AuthManager.apiKey(securityName, security, {
                apiKey: apiKey
              });
              $uibModalInstance.close();
            };
          }],
        size: 'large'
      });
    } else {
      window.customAlert('Not yet supported');
    }
  };
});
