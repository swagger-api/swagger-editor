/*
 ** © 2014 by Philipp Dunkel <pip@pipobscure.com>
 ** Licensed under MIT License.
 */

/* jshint node:true */
'use strict';

var Native = require('./build/Release/fse');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

inherit(Native.FSEvents, EventEmitter);
module.exports = watch;
module.exports.getInfo = getInfo;
module.exports.FSEvents = Native.FSEvents;
module.exports.Constants = Native.Constants;

function watch(path) {
  var fse = new Native.FSEvents(String(path || ''), handler);
  EventEmitter.call(fse);
  return fse;

  function handler(path, flags, id) {
    setImmediate(function() {
      fse.emit('fsevent', path, flags, id);
      var info = getInfo(path, flags);
      info.id = id;

      if (info.event === 'moved') {
        fs.stat(info.path, function(err, stat) {
          info.event = (err || !stat) ? 'moved-out' : 'moved-in';
          fse.emit('change', path, info);
          fse.emit(info.event, path, info);
        });
      } else {
        fse.emit('change', path, info);
        fse.emit(info.event, path, info);
      }
    });
  }
}

function inherit(ctor, superCtor) {
  ctor.super_ = superCtor;
  var proto = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Object.keys(ctor.prototype).forEach(function(key) {
    Object.defineProperty(proto, key, {
      value: ctor.prototype[key],
      writable: true,
      enumerable: true,
      configurable: true
    });
  });
  ctor.prototype = proto;
}

function getFileType(flags) {
  if (Native.Constants.kFSEventStreamEventFlagItemIsFile & flags) return 'file';
  if (Native.Constants.kFSEventStreamEventFlagItemIsDir & flags) return 'directory';
  if (Native.Constants.kFSEventStreamEventFlagItemIsSymlink & flags) return 'symlink';
}

function getEventType(flags) {
  if (Native.Constants.kFSEventStreamEventFlagItemRemoved & flags) return 'deleted';
  if (Native.Constants.kFSEventStreamEventFlagItemRenamed & flags) return 'moved';
  if (Native.Constants.kFSEventStreamEventFlagItemCreated & flags) return 'created';
  if (Native.Constants.kFSEventStreamEventFlagItemModified & flags) return 'modified';
  return 'unknown';
}

function getFileChanges(flags) {
  return {
    inode: !! (Native.Constants.kFSEventStreamEventFlagItemInodeMetaMod & flags),
    finder: !! (Native.Constants.kFSEventStreamEventFlagItemFinderInfoMod & flags),
    access: !! (Native.Constants.kFSEventStreamEventFlagItemChangeOwner & flags),
    xattrs: !! (Native.Constants.kFSEventStreamEventFlagItemXattrMod & flags)
  };
}

function getInfo(path, flags) {
  return {
    path: path,
    event: getEventType(flags),
    type: getFileType(flags),
    changes: getFileChanges(flags),
    flags: flags
  };
}
