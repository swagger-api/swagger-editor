PhonicsApp.config( ['$provide', function ($provide) {
  $provide.constant('defaults',

  // BEGIN-DEFAUNTAS-JSON
  {
   downloadZipUrl: 'http://generator.wordnik.com/online/api/gen/download/',
   apiGenUrl: 'http://generator.wordnik.com/online/api/gen/{type}/{kind}',
   exampleFiles: ['default.yaml', 'petstore.yaml']
  }
  // END-DEFAULTS-JSON

  );
}]);
