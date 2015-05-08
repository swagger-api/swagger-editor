'use strict';

var fs = require('fs');

var distPackage = require('./npm.json');
var sourcePackage = require('../package.json');

distPackage.version = sourcePackage.version;

fs.writeFileSync('./dist/package.json', JSON.stringify(distPackage), null, 4);
