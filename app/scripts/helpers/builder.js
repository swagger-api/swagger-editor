'use strict';


var load = _.memoize(jsyaml.load);

function buildDocs($scope, value){
  var json;

  $scope.invalidDocs = false;
  try {
    json = load(value);
  }catch(e){
    $scope.invalidDocs = true;
    return;
  }
  json = resolve(json);
  if(json && json.paths){
    $scope.paths = json.paths;
    $scope.$digest();
  }
}

function resolve(json, root){
  if (!root) {
    root = json;
  }

  if(Array.isArray(json)){
    return json.map(function (item) {
      return resolve(item, root);
    });
  }

  if(typeof json !== 'object'){
    return json;
  }


  var result = {};
  Object.keys(json).forEach(function (key) {
    if(key === '$ref') {
      return lookup(json[key], root);
    } else {
      result[key] = resolve(json[key], root);
    }
  });
  return result;
}

function lookup (address, root) {
  if(address.indexOf('#/') !== 0) {
    throw new Error('Can not lookup ' + address + ' in ' + JSON.stringify(root));
  }
  var path = address.substring(2).split('/');
  var current = root;
  var key;
  while(path.length){
    key = path.shift();
    if (!current[key]) {
      throw new Error('Can not lookup ' + key + ' in ' + JSON.stringify(current));
    }
    current = current[key];
  }
  return current;
}


PhonicsApp.value('builderHelper', {
  buildDocs: _.debounce(buildDocs, 300),
});
