/*
 * inject-dependencies.js
 * https://github.com/stephenplusplus/wiredep
 *
 * Copyright (c) 2013 Stephen Sawchuk
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var globalDependenciesSorted;
var ignorePath;
var fileTypes;

var fileTypesDefault = {
  html: {
    block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
    detect: {
      js: /<script.*src=['"](.+)['"]>/gi,
      css: /<link.*href=['"](.+)['"]/gi
    },
    replace: {
      js: '<script src="{{filePath}}"></script>',
      css: '<link rel="stylesheet" href="{{filePath}}" />'
    }
  },

  jade: {
    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
    detect: {
      js: /script\(.*src=['"](.+)['"]>/gi,
      css: /link\(href=['"](.+)['"]/gi
    },
    replace: {
      js: 'script(src=\'{{filePath}}\')',
      css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
    }
  },

  sass: {
    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
    detect: {
      css: /@import\s['"](.+)['"]/gi,
      sass: /@import\s['"](.+)['"]/gi,
      scss: /@import\s['"](.+)['"]/gi
    },
    replace: {
      css: '@import {{filePath}}',
      sass: '@import {{filePath}}',
      scss: '@import {{filePath}}'
    }
  },

  scss: {
    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
    detect: {
      css: /@import\s['"](.+)['"]/gi,
      sass: /@import\s['"](.+)['"]/gi,
      scss: /@import\s['"](.+)['"]/gi
    },
    replace: {
      css: '@import "{{filePath}}";',
      sass: '@import "{{filePath}}";',
      scss: '@import "{{filePath}}";'
    }
  },

  yaml: {
    block: /(([ \t]*)#\s*bower:*(\S*))(\n|\r|.)*?(#\s*endbower)/gi,
    detect: {
      js: /-\s(.+)/gi,
      css: /-\s(.+)/gi
    },
    replace: {
      js: '- {{filePath}}',
      css: '- {{filePath}}'
    }
  }
};

fileTypesDefault.yml = fileTypesDefault.yaml;
fileTypesDefault.htm = fileTypesDefault.html;
fileTypesDefault['default'] = fileTypesDefault.html;

/**
 * Find references already on the page, not in a Bower block.
 */
var filesCaught = [];
var findReferences = function (match, reference) {
  filesCaught.push(reference);
  return match;
};


var replaceIncludes = function (file, fileType, returnType) {
  /**
   * Callback function after matching our regex from the source file.
   *
   * @param  {array}  match       strings that were matched
   * @param  {string} startBlock  the opening <!-- bower:xxx --> comment
   * @param  {string} spacing     the type and size of indentation
   * @param  {string} blockType   the type of block (js/css)
   * @param  {string} oldScripts  the old block of scripts we'll remove
   * @param  {string} endBlock    the closing <!-- endbower --> comment
   * @return {string} the new file contents
   */
  return function (match, startBlock, spacing, blockType, oldScripts, endBlock, offset, string) {
    blockType = blockType || 'js';

    var newFileContents = startBlock;
    var dependencies = globalDependenciesSorted[blockType] || [];

    string = string.substr(0, offset) + string.substr(offset + match.length);

    string.
      replace(oldScripts, '').
      replace(fileType.detect[blockType], findReferences);

    spacing = returnType + spacing.replace(/\r|\n/g, '');

    dependencies.
      map(function (filePath) {
        return path.join(
          path.relative(path.dirname(file), path.dirname(filePath)),
          path.basename(filePath)
        ).replace(/\\/g, '/').replace(ignorePath, '');
      }).
      filter(function (filePath) {
        return filesCaught.indexOf(filePath) === -1;
      }).
      forEach(function (filePath) {
        newFileContents += spacing + fileType.replace[blockType].replace('{{filePath}}', filePath);
      });

    return newFileContents + spacing + endBlock;
  };
};


/**
 * Take a file path, read its contents, inject the Bower packages, then write
 * the new file to disk.
 *
 * @param  {string} filePath  path to the source file
 */
var injectScripts = function (filePath) {
  var contents = String(fs.readFileSync(filePath));
  var fileExt = path.extname(filePath).substr(1);
  var fileType = fileTypes[fileExt] || fileTypes['default'];
  var returnType = /\r\n/.test(contents) ? '\r\n' : '\n';

  fs.writeFileSync(filePath, contents.replace(
    fileType.block,
    replaceIncludes(filePath, fileType, returnType)
  ));
};


var injectScriptsStream = function (filePath, contents, fileExt) {
  var returnType = /\r\n/.test(contents) ? '\r\n' : '\n';
  var fileType = fileTypes[fileExt] || fileTypes['default'];

  return contents.replace(
    fileType.block,
    replaceIncludes(filePath, fileType, returnType)
  );
};


/**
 * Injects dependencies into the specified HTML file.
 *
 * @param  {object} config  the global configuration object.
 * @return {object} config
 */
module.exports = function inject(config) {
  var stream = config.get('stream');

  globalDependenciesSorted = config.get('global-dependencies-sorted');
  ignorePath = config.get('ignore-path');
  fileTypes = _.clone(fileTypesDefault, true);

  _(config.get('file-types')).each(function (fileTypeConfig, fileType) {
    fileTypes[fileType] = fileTypes[fileType] || {};
    _.each(fileTypeConfig, function (config, configKey) {
      if (_.isPlainObject(fileTypes[fileType][configKey])) {
        fileTypes[fileType][configKey] =
          _.assign(fileTypes[fileType][configKey], config);
      } else {
        fileTypes[fileType][configKey] = config;
      }
    });
  });

  if (stream.src) {
    config.set('stream', {
      src: injectScriptsStream(stream.path, stream.src, stream.fileType),
      fileType: stream.fileType
    });
  } else {
    config.get('src').forEach(injectScripts);
  }

  return config;
};
