'use strict';
var debug = require('debug')('fileprocessor');
var File = require('./file');
var _ = require('lodash');

var _defaultPatterns = {
	'html': [
      /*jshint regexp:false */
      [ /<script.+src=['"]([^"']+)["']/gm,
      'Update the HTML to reference our concat/min/revved script files'
      ],
      [ /<link[^\>]+href=['"]([^"']+)["']/gm,
      'Update the HTML with the new css filenames'
      ],
      [ /<img[^\>]+src=['"]([^"']+)["']/gm,
      'Update the HTML with the new img filenames'
      ],
      [ /data-main\s*=['"]([^"']+)['"]/gm,
      'Update the HTML with data-main tags',
      function (m) { return m.match(/\.js$/) ? m : m + '.js'; },
      function (m) { return m.replace('.js', ''); }
      ],
      [ /data-(?!main).[^=]+=['"]([^'"]+)['"]/gm,
      'Update the HTML with data-* tags'
      ],
      [ /url\(\s*['"]([^"']+)["']\s*\)/gm,
      'Update the HTML with background imgs, case there is some inline style'
      ],
      [ /<a[^\>]+href=['"]([^"']+)["']/gm,
      'Update the HTML with anchors images'
      ],
      [/<input[^\>]+src=['"]([^"']+)["']/gm,
      'Update the HTML with reference in input'
      ]
    ],
	  'css': [
      /*jshint regexp:false */
      [ /(?:src=|url\(\s*)['"]?([^'"\)]+)['"]?\s*\)?/gm,
      'Update the CSS to reference our revved images'
      ]
    ]
  };

var FileProcessor = module.exports = function(patterns, finder, logcb) {
	if (!patterns) {
		throw new Error('No pattern given');
	}

	if (typeof patterns  === 'string' || patterns instanceof String) {
		if (!_.contains(_.keys(_defaultPatterns), patterns)) {
			throw new Error('Unsupported pattern: ' + patterns);
		}
		this.patterns = _defaultPatterns[patterns];
	}else {
		// FIXME: check the pattern format
		this.patterns = patterns;
	}

	this.log = logcb || function(){};

	if (!finder) {
		throw new Error('Missing parameter: finder');
	}
	this.finder = finder;
};

//
// Replace blocks by their target
//
FileProcessor.prototype.replaceBlocks = function replaceBlocks(file) {
  var result = file.content;
  var linefeed = /\r\n/g.test(result) ? '\r\n' : '\n';
  file.blocks.forEach(function (block) {
    var blockLine = block.raw.join(linefeed);
    result = result.replace(blockLine, this.replaceWith(block));
  }, this);
  return result;
};


FileProcessor.prototype.replaceWith = function replaceWith(block) {
  var result;
  var dest = block.dest;
  var conditionalStart = block.conditionalStart ? block.conditionalStart + '\n' + block.indent : '';
  var conditionalEnd = block.conditionalEnd ? '\n' + block.indent + block.conditionalEnd : '';
  if (block.type === 'css') {
    var media = block.media ? ' media="' + block.media + '"' : '';
    result = block.indent + conditionalStart + '<link rel="stylesheet" href="' + dest + '"' + media + '/>' + conditionalEnd;
  } else if (block.defer) {
    result = block.indent + conditionalStart + '<script defer src="' + dest + '"><\/script>' + conditionalEnd;
  } else if (block.type === 'js') {
    result = block.indent + conditionalStart + '<script src="' + dest + '"><\/script>' + conditionalEnd;
  } /*else {
    result = '';
  }*/
  return result;
};

//
// Replace reference to scripts, css, images, .. in +lines+ with their revved version
// If +lines+ is not furnished used instead the cached version (i.e. stored at constructor time)
//
FileProcessor.prototype.replaceWithRevved = function replaceWithRevved(lines, assetSearchPath) {
    // Replace script sources
    var self = this;
    var content = lines;
    var regexps = this.patterns;
    var identity = function (m) { return m; };

    // Replace reference to script with the actual name of the revved script
    regexps.forEach(function (rxl) {
      var filterIn = rxl[2] || identity;
      var filterOut = rxl[3] || identity;

      self.log(rxl[1]);
      content = content.replace(rxl[0], function (match, src) {
        // Consider reference from site root
        var srcfile = filterIn(src);

        debug('Let\'s replace ' + src);

        debug('Looking for revved version of ' + srcfile + ' in ', assetSearchPath);

        var file = self.finder.find(srcfile, assetSearchPath);

        debug('Found file \'%s\'', file);

        var res = match.replace(src, filterOut(file));
        if (srcfile !== file) {
          self.log(match + ' changed to ' + res);
        }
        return res;
      });
    });

    return content;
  };



FileProcessor.prototype.process = function(filename, assetSearchPath) {
  debug('processing file %s', filename, assetSearchPath);

  if (typeof filename  === 'string' || filename instanceof String) {
    this.file = new File(filename);
  } else {
    // filename is an object and should conform to lib/file.js API
    this.file = filename;
  }

  if (assetSearchPath && assetSearchPath.length !== 0) {
    this.file.searchPath = assetSearchPath;
  }

	var content = this.replaceWithRevved(this.replaceBlocks(this.file), this.file.searchPath);

	return content;
};
