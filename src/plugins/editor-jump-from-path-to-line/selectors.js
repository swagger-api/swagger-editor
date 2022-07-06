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
  (state, path) => path, // input from arg to forward to output
  (path) => {
    if (path && typeof path === 'string') {
      return path;
    }
    if (path && Array.isArray(path)) {
      return transformArrayToStringPath(path);
    }
    if (path && List.isList(path)) {
      return transformImListToStringPath(path);
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
