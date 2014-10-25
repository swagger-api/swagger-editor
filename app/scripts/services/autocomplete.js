'use strict';

PhonicsApp.service('Autocomplete', function Autocomplete(snippets, ASTManager) {
  var editor = null;
  var keywords = [
    'get',
    'post',
    'delete',
    'options',
    'put',
    'headers',
    'swagger',
    'info',
    'host',
    'basePath',
    'schemes',
    'consumes',
    'produces',
    'paths',
    'definitions',
    'parameters',
    'responses',
    'security',
    'securityDefinitions',
    'tags',
    'externalDocs',
    'title',
    'version',
    'description',
    'termsOfService',
    'contact',
    'license',
    'name',
    'url',
    'email',
    'name',
    'url',
    'description',
    'url',
    'tags',
    'summary',
    'description',
    'externalDocs',
    'operationId',
    'produces',
    'consumes',
    'parameters',
    'responses',
    'schemes',
    'deprecated',
    'security',
    '$ref',
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'parameters',
    'description',
    'schema',
    'headers',
    'examples',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'description',
    'description',
    'name',
    'in',
    'required',
    'schema',
    'required',
    'in',
    'description',
    'name',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'required',
    'in',
    'description',
    'name',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'required',
    'in',
    'description',
    'name',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'required',
    'in',
    'description',
    'name',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'format',
    'title',
    'description',
    'default',
    'multipleOf',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'maxProperties',
    'minProperties',
    'required',
    'enum',
    'type',
    'items',
    'allOf',
    'properties',
    'discriminator',
    'readOnly',
    'xml',
    'externalDocs',
    'example',
    'type',
    'format',
    'items',
    'collectionFormat',
    'default',
    'maximum',
    'exclusiveMaximum',
    'minimum',
    'exclusiveMinimum',
    'maxLength',
    'minLength',
    'pattern',
    'maxItems',
    'minItems',
    'uniqueItems',
    'enum',
    'multipleOf',
    'name',
    'namespace',
    'prefix',
    'attribute',
    'wrapped',
    'name',
    'description',
    'externalDocs',
    'type',
    'description',
    'type',
    'name',
    'in',
    'description',
    'type',
    'flow',
    'scopes',
    'authorizationUrl',
    'description',
    'type',
    'flow',
    'scopes',
    'tokenUrl',
    'description',
    'type',
    'flow',
    'scopes',
    'tokenUrl',
    'description',
    'type',
    'flow',
    'scopes',
    'authorizationUrl',
    'tokenUrl',
    'description'
  ];

  keywords = keywords.map(function (keyword) {
    return {
      name: keyword,
      value: keyword,
      score: 200,
      meta: 'keyword'
    };
  });

  /*
   * Check if a path is match with
   * @param {array} path - path
   * @param {array} matcher - matcher
   * @returns {boolean} - true if it's match
  */
  function isMatchPath(path, matcher) {
    if (!Array.isArray(path) || !Array.isArray(matcher)) {
      return false;
    }

    if (path.length !== matcher.length) {
      return false;
    }

    for (var i = 0; i < path.length; i++) {
      if (path[i] !== matcher[i]) {
        return false;
      }
    }
    return true;
  }

  function filterForSnippets(pos) {
    ASTManager.refresh(editor.getValue());

    // pos.column is 1 more because the character is already inserted
    var path = ASTManager.pathForPosition(pos.row, pos.column - 1);

    // If there is no path being returned by AST Manager and only one character
    // was typed, path is root
    if (!path && pos.column === 1) {
      path = [];
    }

    return function filter(snippet) {
      return isMatchPath(path, snippet.path);
    };
  }

  // function getKeywordsForPosition(pos) {
  //   var path = ASTManager.pathForPosition(pos.row);
  //   var schema = Resolver.resolve(schema);
  //   var key;

  //   if (!Array.isArray(path)) {
  //     return [];
  //   }

  //   while (path.length && schema.properties) {
  //     key = path.pop();
  //     schema = schema.properties[key];
  //   }

  //   return Object.keys(schema.properties).map(function(keyword) {
  //     return {
  //       name: keyword,
  //       value: keyword,
  //       score: 300,
  //       meta: 'swagger'
  //     };
  //   });
  // }

  /*
   * Gives score to snippet based on their position
   * FIXME: right now it gives 100 to any snippet.
  */
  function sortSnippets(snippet) {
    snippet.score = 1000;
    return snippet;
  }

  var KeywordCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
      editor.completer.autoSelect = true;

      var snippetsForPos = snippets.filter(filterForSnippets(pos))
        .map(function (snippet) {
          return {
            caption: snippet.name,
            snippet: snippet.content,
            meta: 'snippet'
          };
        })
        .map(sortSnippets);

      var completions = keywords.concat(snippetsForPos);
      callback(null, completions);
    }
  };

  this.init = function (e) {
    editor = e;
    editor.completers = [KeywordCompleter];
  };
});
