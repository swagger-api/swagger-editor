'use strict';

/*
 * Provide embedded document
*/
SwaggerEditor.service('Embedded', function Embedded(defaults) {

  var embeddedSwagger = $('#embedded-swagger').text();

  // to avoid being replaced in embedded doc we break it down.
  var yamlKey = ['___', 'YAML', '___'].join('');
  var titleKey = ['___', 'TITLE', '___'].join('');
  var defaultsKey = ['___', 'DEFAULTS', '___'].join('');

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
   * @returns {string|null} - YAML of embedded Swagger document
  */
  this.get = function () {

    // if embedded swagger is not provided and the template was not parsed
    // return null for it so we can fall back to swagger document in the local
    // storage
    if (embeddedSwagger === yamlKey) {
      return null;
    }

    return embeddedSwagger;
  };

  /*
   * Uses embedded-docs.html as a template to generate a documentation page
   * based on current Swagger YAML
   * @param yaml {string} - the YAML content
   * @returns promise - a promise that will resolve to documentation page
  */
  this.template = function (yaml) {
    return $.get('embedded-docs.html').then(function (html) {

      // TODO: get Swagger document title and set title from that
      var title = 'Swagger';

      // Because embedded-docs.html is very large and may contain all sort of
      // strings we use a custom templating language here.
      return html.replace(yamlKey, yaml)
        .replace(titleKey, title)
        .replace(defaultsKey, JSON.stringify(defaults));
    });
  };
});
