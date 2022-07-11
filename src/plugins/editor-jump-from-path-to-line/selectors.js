import { createSelector } from 'reselect';
import { List } from 'immutable';

const transformArrayToStringPath = (arr) => {
  if (arr.at(0) !== '/') {
    return `/${arr.join('')}`;
  }
  return arr.join('/');
};

const transformImListToStringPath = (list) => {
  const arr = list.toJS();
  if (arr.at(0) !== '/') {
    return `/${arr.join('')}`;
  }
  return arr.join('');
};

// compared to `path`, each element inside `specPath` does not contain leading `/`
const transformArrayToStringSpecPath = (arr) => {
  if (arr.at(0) !== '/') {
    return `/${arr.join('/')}`;
  }
  return arr.join('/');
};

// compared to `path`, each element inside `specPath` does not contain leading `/`
const transformImListToStringSpecPath = (list) => {
  const arr = list.toJS();
  if (arr.at(0) !== '/') {
    return `/${arr.join('/')}`;
  }
  return arr.join('/');
};

export const getSpecLineFromPath = createSelector(
  (state) => state.get('foo'), // input from state
  (state, bar) => bar, // input from arg to forward to output
  (foo, bar) => {
    // do stuff with values: foo, bar => then return a result
    return bar || [];
  }
);

// apidom-ls expects a String as arg
export const bestJumpPath = createSelector(
  (state, pathObj) => pathObj, // input from arg to forward to output
  ({ path, specPath }) => {
    if (path && typeof path === 'string') {
      return path;
    }
    if (path && Array.isArray(path) && path.length > 0) {
      return transformArrayToStringPath(path);
    }
    if (path && List.isList(path) && path.size > 0) {
      return transformImListToStringPath(path);
    }
    if (specPath && typeof specPath === 'string') {
      return specPath;
    }
    if (specPath && Array.isArray(specPath) && specPath.length > 0) {
      return transformArrayToStringSpecPath(specPath);
    }
    if (specPath && List.isList(specPath) && specPath.size > 0) {
      console.log('ImList specPath case');
      return transformImListToStringSpecPath(specPath);
    }
    return '';
    // LEGACY:
    // fallback with 'specPath' if 'path' doesn't exist
    // step through specSelectors.specJson
    // case 1: a $ref exists in the source
    // case 2: this path exists in the source
  }
);

// legacy:
// import { unescapeJsonPointerToken } from ...
// function jsonPointerToArray
