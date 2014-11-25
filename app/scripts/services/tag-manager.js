'use strict';

PhonicsApp.service('TagManager', function TagManager() {
  var tags = {};
  var tagsCount = 0;

  this.resetTags = function resetTags() {
    tags = {};
    tagsCount = 0;
  };

  this.tagIndexFor = function (tag) {
    if (!tags[tag]) {
      tagsCount++;
      tags[tag] = tagsCount;
      return tagsCount;
    }
    return tags[tag];
  };

  this.getAllTags = function () {
    return Object.keys(tags);
  };
});
