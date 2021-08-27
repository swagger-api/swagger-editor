/* eslint-disable import/no-extraneous-dependencies */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// https://medium.com/hired-engineering/setting-up-monaco-with-jest-e1e4c963ac
import 'jest-canvas-mock';

document.queryCommandSupported = () => false;
