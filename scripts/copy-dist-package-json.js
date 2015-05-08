'use strict';

var fs = require('fs');
var path = require('path');

var distPackage = require('./scripts/npm.json');
var sourcePackage = require('./package.json');

distPackage.version = sourcePackage.version;

fs.writeFileSync(path.join('.', 'dist', 'package.json'),
  JSON.stringify(distPackage), null, 4);
