/* eslint-disable import/prefer-default-export */
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
      return transformImListToStringSpecPath(specPath);
    }
    return '';
  }
);
