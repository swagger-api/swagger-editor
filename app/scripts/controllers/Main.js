'use strict';

PhonicsApp.controller('MainCtrl', ['$rootScope', 'Editor', MainCtrl]);

function MainCtrl($rootScope, Editor) {
  $rootScope.$on('$stateChangeStart', Editor.initializeEditor);
}
