/*
 * grunt-autoprefixer
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    var autoprefixer = require('autoprefixer');

    grunt.registerMultiTask(
        'autoprefixer',
        'Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website.',
        function() {
            var options = this.options();

            /**
             * @type {Autoprefixer}
             */
            var compiler = autoprefixer(options.browsers);

            // Iterate over all specified file groups.
            this.files.forEach(function(f) {

                /**
                 * @type {string[]}
                 */
                var sources = f.src.filter(function(filepath) {

                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                // Write the destination file, or source file if destination isn't specified.
                if (typeof f.dest !== 'undefined') {

                    // Concat specified files.
                    var css = sources.map(function(filepath) {
                        return grunt.file.read(filepath);
                    }).join(grunt.util.linefeed);

                    grunt.file.write(f.dest, compiler.compile(css));
                    grunt.log.writeln('Prefixed file "' + f.dest + '" created.');

                } else {

                    sources.forEach(function(filepath) {
                        grunt.file.write(filepath, compiler.compile(grunt.file.read(filepath)));
                        grunt.log.writeln('File "' + filepath + '" prefixed.');
                    });
                }

            });
        }
    );
};
