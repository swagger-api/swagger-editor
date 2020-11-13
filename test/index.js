import { assert } from 'chai';

import testFn from '../src/index';

describe('suite', function () {
  it('test', function () {
    assert.isTrue(testFn());
  });
});
