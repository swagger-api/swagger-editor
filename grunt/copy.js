'use strict';

module.exports = {
  dist: {
    files: [
    {
      expand: true,
      cwd: 'app/images',
      src: '{,*/}*.{png,jpg,jpeg,gif}',
      dest: 'dist/images'
    },
    {
      expand: true,
      dot: true,
      cwd: 'app',
      dest: 'dist',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        '*.html',
        'config/defaults.json',
        'images/{,*/}*.{webp,svg,png}',
        'views/{,*/}*.html',
        'templates/{,*/}*.html',
        'fonts/*',
        'spec-files/*',
        'CNAME',
        'styles/branding.css',
        'scripts/branding.js'
      ]
    },
    {
      expand: true,
      cwd: '.tmp/images',
      dest: 'dist/images',
      src: ['generated/*']
    },
    {
      expand: true,
      cwd: 'bower_components/bootstrap/dist',
      src: 'fonts/*',
      dest: 'dist'
    }]
  },
  styles: {
    expand: true,
    cwd: 'app/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  },
  ace: {
    expand: true,
    cwd: 'app/bower_components/ace-builds/src-min-noconflict/',
    dest: 'dist/bower_components/ace-builds/src-noconflict/',
    src: [
      'theme-*.js',
      'snippets/yaml.js',
      'ext-settings_menu.js',
      'ext-language_tools.js',
      'ext-searchbox.js',
      'mode-yaml.js',
      'mode-json.js',
      'keybinding-*.js'
    ],
  },
  sourceCodePro: {
    expand: true,
    cwd: 'app/bower_components/source-code-pro/',
    // Upstream source-code-pro.css loads fonts by relative path
    // from it's location, and since source-code-pro.css is bundled
    // in dist/styles/main.css, we need to copy fonts there too.
    dest: 'dist/styles/',
    src: [
      '**/*.eot',
      '**/*.otf',
      '**/*.ttf',
      '**/*.woff',
      '**/*.woff2'
    ]
  }
};
