'use strict';

PhonicsApp.controller('MainCtrl', function MainCtrl($rootScope, Editor, defaults) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);

  // TODO: find a better way to add the branding class (grunt html template)
  $('body').addClass(defaults.brandingCssClass);
});
