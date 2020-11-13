import { assert } from 'chai';
import ApiDOMParser from 'apidom-parser';
import * as jsonAdapter from 'apidom-parser-adapter-json';

describe('apidom-integration', function () {
  it('should integrate ApiDOM', async function () {
    const parser = ApiDOMParser();
    parser.use(jsonAdapter);
    const result = await jsonAdapter.parse('{"prop":"val"}');

    assert.strictEqual(result.element, 'parseResult');
  });
});
