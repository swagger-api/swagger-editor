PhonicsApp.config( ['$provide', function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAUNTAS-JSON
  {
   downloadZipUrl: 'http://generator.wordnik.com/online/api/gen/download/',
   apiGenUrl: 'http://generator.wordnik.com/online/api/gen/{type}/{kind}',
   exampleFiles: ['default.yaml', 'minimal.yaml', 'petstore.yaml', 'heroku-pets.yaml'],
   xhrChangesTo: '/spec'
  }
  // END-DEFAULTS-JSON

  );
}]);
