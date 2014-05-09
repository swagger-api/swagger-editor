# grunt-autoprefixer
[![Build Status](https://travis-ci.org/nDmitry/grunt-autoprefixer.png?branch=master)](https://travis-ci.org/nDmitry/grunt-autoprefixer) 
[![Dependency Status](https://david-dm.org/nDmitry/grunt-autoprefixer.png)](https://david-dm.org/nDmitry/grunt-autoprefixer)

> [Autoprefixer](https://github.com/ai/autoprefixer) parses CSS and adds vendor-prefixed CSS properties using the [Can I Use](http://caniuse.com/) database.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-autoprefixer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-autoprefixer');
```

## The "autoprefixer" task

### Overview
In your project's Gruntfile, add a section named `autoprefixer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autoprefixer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.browsers
Type: `Array`
Default value: `['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1']`

You can specify browsers actual for your project:

```js
options: {
  browsers: ['last 2 version', 'ie 8', 'ie 7']
}
```

[View more](https://github.com/ai/autoprefixer#browsers).

### Usage Examples

```js
grunt.initConfig({

  autoprefixer: {

    options: {
      // Task-specific options go here.
    },

    // just prefix the specified file
    single_file: {
      options: {
        // Target-specific options go here.
      },
      src: 'src/css/file.css',
      dest: 'dest/css/file.css'
    },

    // prefix all specified files and save them separately
    multiple_files: {
      expand: true,
      flatten: true,
      src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
      dest: 'dest/css/' // -> dest/css/file1.css, dest/css/file2.css
    },

    // prefix all specified files and concat them into the one
    concat: {
      src: 'src/css/*.css', // -> src/css/file1.css, src/css/file2.css
      dest: 'dest/css/concatenated.css' // -> dest/css/concatenated.css
    },

    // if you specify only `src` param, the destination will be set automatically,
    // so specified source files will be overwritten
    no_dest: {
      src: 'dest/css/file.css' // globbing is also possible here
    }
  }

});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nDmitry/grunt-autoprefixer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

