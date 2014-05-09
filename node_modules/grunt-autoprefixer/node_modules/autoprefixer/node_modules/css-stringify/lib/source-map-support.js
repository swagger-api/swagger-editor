
/**
 * Module dependencies.
 */

var SourceMap = require('source-map').SourceMapGenerator;

/**
 * Expose `mixin()`.
 */

module.exports = mixin;

/**
 * Mixin source map support into `compiler`.
 *
 * @param {Compiler} compiler
 * @api public
 */

function mixin(compiler) {
  var file = compiler.options.filename || 'generated.css';
  compiler.map = new SourceMap({ file: file });
  compiler.position = { line: 1, column: 1 };
  for (var k in exports) compiler[k] = exports[k];
}

/**
 * Update position.
 *
 * @param {String} str
 * @api private
 */

exports.updatePosition = function(str) {
  var lines = str.match(/\n/g);
  if (lines) this.position.line += lines.length;
  var i = str.lastIndexOf('\n');
  this.position.column = ~i ? str.length - i : this.position.column + str.length;
};

/**
 * Emit `str`.
 *
 * @param {String} str
 * @param {Number} [pos]
 * @param {Boolean} [startOnly]
 * @return {String}
 * @api private
 */

exports.emit = function(str, pos, startOnly) {
  if (pos && pos.start) {
    this.map.addMapping({
      source: pos.source || 'source.css',
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: pos.start.line,
        column: pos.start.column - 1
      }
    });
  }

  this.updatePosition(str);

  if (!startOnly && pos && pos.end) {
    this.map.addMapping({
      source: pos.source || 'source.css',
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: pos.end.line,
        column: pos.end.column - 1
      }
    });
  }

  return str;
};
