'use strict';

PhonicsApp.config(['$provide', function ($provide) {
  $provide.constant('strings', {
    stausMessages: {
      '-2': 'Lost connection',
      '-1': 'Error!',
      0: 'Working...',
      1: 'Saved.'
    }
  });
}]);
