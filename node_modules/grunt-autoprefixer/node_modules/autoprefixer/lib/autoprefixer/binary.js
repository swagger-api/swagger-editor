(function() {
  var Binary, autoprefixer, fs;

  autoprefixer = require('../autoprefixer');

  fs = require('fs');

  Binary = (function() {
    function Binary(process) {
      this["arguments"] = process.argv.slice(2);
      this.stdin = process.stdin;
      this.stderr = process.stderr;
      this.stdout = process.stdout;
      this.status = 0;
      this.command = 'compile';
      this.inputFiles = [];
      this.parseArguments();
    }

    Binary.prototype.help = function() {
      return 'Usage: autoprefixer [OPTION...] FILES\n\nParse CSS files and add prefixed properties and values.\n\nOptions:\n  -b, --browsers BROWSERS  add prefixes for selected browsers\n  -o, --output FILE        set output CSS file\n  -i, --inspect            show selected browsers and properties\n  -h, --help               show help text\n  -v, --version            print program version';
    };

    Binary.prototype.desc = function() {
      return 'Files:\n  By default, prefixed CSS will rewrite original files.\n  If you didn\'t set input files, autoprefixer will +\n    read from stdin stream.\n  Output CSS will be written to stdout stream on +\n    `-o -\' argument or stdin input.\n\nBrowsers:\n  Separate browsers by comma. For example, `-b "> 1%, opera 12"\'.\n  You can set browsers by global usage statictics: `-b \"> 1%\"\'.\n  or last version: `-b "last 2 versions"\' (by default).'.replace(/\+\s+/g, '');
    };

    Binary.prototype.print = function(str) {
      str = str.replace(/\n$/, '');
      return this.stdout.write(str + "\n");
    };

    Binary.prototype.error = function(str) {
      this.status = 1;
      return this.stderr.write(str + "\n");
    };

    Binary.prototype.version = function() {
      return require('../../package.json').version;
    };

    Binary.prototype.parseArguments = function() {
      var arg, args;
      args = this["arguments"].slice();
      while (args.length > 0) {
        arg = args.shift();
        switch (arg) {
          case '-h':
          case '--help':
            this.command = 'showHelp';
            break;
          case '-v':
          case '--version':
            this.command = 'showVersion';
            break;
          case '-i':
          case '--inspect':
            this.command = 'inspect';
            break;
          case '-u':
          case '--update':
            this.command = 'update';
            break;
          case '-b':
          case '--browsers':
            this.requirements = args.shift().split(',').map(function(i) {
              return i.trim();
            });
            break;
          case '-o':
          case '--output':
            this.outputFile = args.shift();
            break;
          default:
            if (arg.match(/^-\w$/) || arg.match(/^--\w[\w-]+$/)) {
              this.command = void 0;
              this.error("autoprefixer: Unknown argument " + arg);
              this.error('');
              this.error(this.help());
            } else {
              this.inputFiles.push(arg);
            }
        }
      }
    };

    Binary.prototype.showHelp = function(done) {
      this.print(this.help());
      this.print('');
      this.print(this.desc());
      return done();
    };

    Binary.prototype.showVersion = function(done) {
      this.print("autoprefixer " + (this.version()));
      return done();
    };

    Binary.prototype.inspect = function(done) {
      this.print(this.compiler().inspect());
      return done();
    };

    Binary.prototype.update = function(done) {
      var coffee, updater,
        _this = this;
      try {
        coffee = require('coffee-script');
      } catch (_error) {
        this.error("Install coffee-script npm package");
        return done();
      }
      updater = require('./updater');
      updater.request(function() {
        return _this.stdout.write('.');
      });
      updater.done(function() {
        _this.print('');
        if (updater.changed.length === 0) {
          _this.print('Everything up-to-date');
        } else {
          _this.print('Update ' + updater.changed.join(' and ') + ' data');
        }
        return done();
      });
      return updater.run();
    };

    Binary.prototype.startWork = function() {
      return this.waiting += 1;
    };

    Binary.prototype.endWork = function() {
      this.waiting -= 1;
      if (this.waiting <= 0) {
        return this.doneCallback();
      }
    };

    Binary.prototype.workError = function(str) {
      this.error(str);
      return this.endWork();
    };

    Binary.prototype.compiler = function() {
      return this.compilerCache || (this.compilerCache = autoprefixer(this.requirements));
    };

    Binary.prototype.compileCSS = function(css, file) {
      var error, prefixed,
        _this = this;
      try {
        prefixed = this.compiler().compile(css);
      } catch (_error) {
        error = _error;
        if (error.autoprefixer || error.css) {
          this.error("autoprefixer: " + error.message);
        } else {
          this.error('autoprefixer: Internal error');
        }
        if (error.css || !error.autoprefixer) {
          if (error.stack != null) {
            this.error('');
            this.error(error.stack);
          }
        }
      }
      if (!prefixed) {
        return this.endWork();
      }
      if (this.outputFile === '-') {
        this.print(prefixed);
        return this.endWork();
      } else if (this.outputFile) {
        try {
          if (!this.outputInited) {
            this.outputInited = true;
            fs.writeFileSync(this.outputFile, '');
          }
          fs.appendFileSync(this.outputFile, prefixed);
          return this.endWork();
        } catch (_error) {
          error = _error;
          return this.workError("autoprefixer: " + error.message);
        }
      } else if (file) {
        return fs.writeFile(file, prefixed, function(error) {
          if (error) {
            _this.error("autoprefixer: " + error);
          }
          return _this.endWork();
        });
      }
    };

    Binary.prototype.compile = function(done) {
      var css, error, file, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      this.waiting = 0;
      this.doneCallback = done;
      if (this.inputFiles.length === 0) {
        this.startWork();
        this.outputFile || (this.outputFile = '-');
        css = '';
        this.stdin.resume();
        this.stdin.on('data', function(chunk) {
          return css += chunk;
        });
        return this.stdin.on('end', function() {
          return _this.compileCSS(css);
        });
      } else {
        _ref = this.inputFiles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          this.startWork();
        }
        _ref1 = this.inputFiles;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          file = _ref1[_j];
          if (!fs.existsSync(file)) {
            this.workError("autoprefixer: File " + file + " doesn't exists");
            continue;
          }
          try {
            css = fs.readFileSync(file).toString();
          } catch (_error) {
            error = _error;
            this.workError("autoprefixer: " + error.message);
            continue;
          }
          this.compileCSS(css, file);
        }
        return false;
      }
    };

    Binary.prototype.run = function(done) {
      if (this.command) {
        return this[this.command](done);
      } else {
        return done();
      }
    };

    return Binary;

  })();

  module.exports = Binary;

}).call(this);
