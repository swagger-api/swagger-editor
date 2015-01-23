'use strict';

SwaggerEditor.service('TagManager', function TagManager($stateParams) {
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
  };

  this.getAllTags = function () {
    return tags;
  };

  this.registerTagsFromSpecs = function (specs) {
    if (!angular.isObject(specs)) {
      return;
    }

    tags = [];

    if (Array.isArray(specs.tags)) {
      specs.tags.forEach(function (tag) {
        if (angular.isString(tag.name)) {
          registerTag(tag.name, tag.description);
        }
      });
    }

    if (Array.isArray(specs.paths)) {
      specs.paths.forEach(function (path) {
        if (Array.isArray(path.operations)) {
          path.operations.forEach(function (operation) {
            if (Array.isArray(operation.tags)) {
              operation.tags.forEach(function (tagName) {
                registerTag(tagName);
              });
            }
          });
        }
      });
    }
  };

  this.getCurrentTags = function () {
    if ($stateParams.tags) {
      return $stateParams.tags.split(',');
    }
    return [];
  };

  function registerTag(tagName, tagDescription) {
    if (!tagName) {
      return;
    }
    var tagNames = tags.map(function (tag) {
      return tag.name;
    });
    if (!_.include(tagNames, tagName)) {
      tags.push(new Tag(tagName, tagDescription));
    }
  }

  this.registerTag = registerTag;
});
