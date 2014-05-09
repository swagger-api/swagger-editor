/*
 ** © 2014 by Philipp Dunkel <pip@pipobscure.com>
 ** Licensed under MIT License.
 */

/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tap').test;

test('functionality testing', function(t) {
  try {
    fs.mkdirSync(__dirname + '/temp');
  } catch (ex) {}
  var evt = require('../')(__dirname + '/temp').start();
  t.on('end', function() {
    evt.stop();
  });
  t.plan(16);

  evt.on('fsevent', function(name, flags, id) {
    if (name === __dirname + '/temp') return;
    if (path.basename(name) === 'created-fsevent') {
      t.ok('number' === typeof flags, 'created file was caught with flags:' + flags);
      t.ok('number' === typeof id, 'id is a number ' + id);
    }
    if (path.basename(name) === 'moved-fsevent') {
      t.ok('number' === typeof flags, 'renamed file was caught with flags:' + flags);
      t.ok('number' === typeof id, 'id is a number ' + id);
    }
  });

  evt.on('change', function(name, info) {
    //console.error(JSON.stringify(info));
    if (name === __dirname + '/temp') return;
    t.ok(name === info.path, 'matched path');
    switch (info.event) {
      case 'created':
        t.ok(path.basename(name) === 'created-fsevent', 'file created: ' + path.basename(name));
        break;
      case 'moved-out':
        t.ok(path.basename(name) === 'created-fsevent', 'file moved out: ' + path.basename(name));
        break;
      case 'moved-in':
        t.ok(path.basename(name) === 'moved-fsevent', 'file moved in: ' + path.basename(name));
        break;
      case 'deleted':
        t.ok(path.basename(name) === 'moved-fsevent', 'file deleted: ' + path.basename(name));
        break;
    }
  });

  setTimeout(function() {
    fs.writeFileSync(__dirname + '/temp/created-fsevent', 'created-fsevent');
  }, 5000);
  setTimeout(function() {
    fs.renameSync(__dirname + '/temp/created-fsevent', __dirname + '/temp/moved-fsevent');
  }, 10000);
  setTimeout(function() {
    fs.unlinkSync(__dirname + '/temp/moved-fsevent');
  }, 15000);
  setTimeout(function() {
    fs.rmdirSync(__dirname + '/temp');
  }, 20000);
});
