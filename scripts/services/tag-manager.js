'use strict';

var angular = require('angular');
var _ = require('lodash');

SwaggerEditor.service('TagManager', function TagManager($stateParams) {
  var tags = [];

  var Tag = function(name, description) {
    this.name = name;
    this.description = description;
  };

  this.resetTags = function resetTags() {
    tags = [];
  };

  this.tagIndexFor = function(tagName) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name === tagName) {
        return i;
      }
    }
  };

  this.getAllTags = function() {
    return tags;
  };

  this.tagsHaveDescription = function() {
    return tags.some(function(tag) {
      return tag.description;
    });
  };

  this.registerTagsFromSpec = function(spec) {
    if (!angular.isObject(spec)) {
      return;
    }

    tags = [];

    if (Array.isArray(spec.tags)) {
      spec.tags.forEach(function(tag) {
        if (tag && angular.isString(tag.name)) {
          registerTag(tag.name, tag.description);
        }
      });
    }

    _.each(spec.paths, function(path) {
      _.each(path, function(operation) {
        if (_.isObject(operation)) {
          _.each(operation.tags, registerTag);
        }
      });
    });
  };

  this.getCurrentTags = function() {
    if ($stateParams.tags) {
      return $stateParams.tags.split(',');
    }
    return [];
  };

  /**
   * @param {string} tagName - tag name
   * @param {string} tagDescription - description
  */
  function registerTag(tagName, tagDescription) {
    if (!tagName) {
      return;
    }
    var tagNames = tags.map(function(tag) {
      return tag.name;
    });
    if (!_.includes(tagNames, tagName)) {
      tags.push(new Tag(tagName, tagDescription));
    }
  }

  this.registerTag = registerTag;
});
