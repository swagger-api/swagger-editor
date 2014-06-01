'use strict';

PhonicsApp.filter('getResourceName', function() {
  return function getResourceNameFilter(resource){
    return resource.resourcePath.replace(/\//g, '');
  };
});
