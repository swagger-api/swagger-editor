'use strict';

var _ = require('lodash');

// Use single curly brace for templates (used in spec)
_.templateSettings = {
  interpolate: /\{(.+?)\}/g
};
