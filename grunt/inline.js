'use strict'

module.exports = {
  options: {
    cssmin: true,
    uglify: true,
    tag: '',
    inlineTagAttributes: {

      // Adds ```<script data-inlined="true">...</script>
      js: 'data-inlined="true"',

      // Adds ```<style data-inlined="true">...</style>```
      css: 'data-inlined="true"'
    },
  },
  app: {
    src: 'app/docs.html',
    dest: 'app/embedded-docs.html'
  },
  // dist: {
  //   files: {
  //     'dist/embedded-docs.html': 'dist/docs.html'
  //   }
  // }
};
