'use strict';

var fs = require('fs');
var path = require('path');

var distPackage = fs.readFileSync(path.join('.', 'scripts', 'npm.json'));
var sourcePackage = fs.readFileSync(path.join('.', 'package.json'));

distPackage = parse(distPackage);
sourcePackage = parse(sourcePackage);

distPackage.version = sourcePackage.version;

fs.writeFileSync(path.join('.', 'dist', 'package.json'),
  JSON.stringify(distPackage), null, 4);


function parse (buffer) {
  return JSON.parse(buffer.toString());
}
