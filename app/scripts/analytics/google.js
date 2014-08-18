'use strict';

(function (i,s,o,g,r,a,m) {i['GoogleAnalyticsObject']=r;i[r]=i[r]||function () {
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

// Load the plugin.
ga('require', 'linker');

// Define which domains to autoLink.
ga('linker:autoLink', [
  'wordnik.github.io',
  'apigee.github.io',
  'swagger.wordnik.com',
  'editor.swagger.wordnik.com'
  ]);

ga(
  'create',
  'UA-51231036-1',
  'auto', {
    'allowLinker': true
  }
  );

ga('send', 'pageview');
