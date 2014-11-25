'use strict';

PhonicsApp.service('TagManager', function TagManager() {
  var tags = [];

  function Tag(name, description) {
    this.name = name;
    this.description = description;
  }

  this.resetTags = function resetTags() {
    tags = [];
  };

  this.tagIndexFor = function (tagName) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name === tagName) {
        return i;
      }
    }

    // If this is a new tag, register it and return it's index
    registerTag(tagName);
    return tags.length - 1;
  };

  this.getAllTags = function () {
    return tags;
  };

  this.registerRootTags = function (rootTags) {
    if (Array.isArray(rootTags)) {
      rootTags.forEach(function (tag) {
        if (angular.isString(tag.name)) {
          registerTag(tag.name, tag.description);
        }
      });
    }
  };

  function registerTag(tagName, tagDescription) {
    var tagNames = tags.map(function (tag) {
      return tag.name;
    });
    if (!_.include(tagNames, tagName)) {
      tags.push(new Tag(tagName, tagDescription));
    }
  }

  this.registerTag = registerTag;
});
