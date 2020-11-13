import ApiDOMParser from 'apidom-parser';
import * as jsonAdapter from 'apidom-parser-adapter-json';

(async () => {
  const parser = ApiDOMParser();
  parser.use(jsonAdapter);
  const result = await jsonAdapter.parse('{"prop":"val"}');
  console.dir(result);
})();

const test = () => true;

export default test;
