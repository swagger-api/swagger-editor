'use strict';

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

if (!fs.existsSync(path.join(cwd, process.argv[2]))) {
  process.exit(1);
}
