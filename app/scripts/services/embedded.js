'use strict';

/*
 * Provide embedded document
*/
SwaggerEditor.service('Embedded', function Embedded() {

  var embeddedSwagger = $('#embedded-swagger').text();

  // try parsing the swagger object with JSON.parse, if it was successful it
  // is in JSON so dump into YAML via jsyaml
  // Otherwise just assume that provided Swagger is in YAML
  try {
    var swaggerObj = JSON.parse(embeddedSwagger);
    embeddedSwagger = jsyaml.dump(swaggerObj);
    console.info('Embedded swagger document is in JSON format');
  } catch (error) {
    console.info('Embedded swagger document is in YAML format');
  }

  /*
   * returns YAML of embedded Swagger document
  */
  this.get = function () {

    // if embedded swagger is not provided and the template was not parsed
    // return null for it so we can fall back to swagger document in the local
    // storage
    if (embeddedSwagger === '{{swagger}}') {
      return null;
    }

    return embeddedSwagger;
  };
});
