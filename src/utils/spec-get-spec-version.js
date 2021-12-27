/* eslint-disable camelcase */
/**
 * Note: as we add more specifications and versions
 * this will generate a lot of flags to track
 * and likely the need to build out a selector for each flag
 * Example:
 * with oas3_1, there will be cases where it is oas3_0 only,
 * oas3_1 only, or anyOf oas3_0/oas3_1
 */

// Note: can adapt to explicitly handle different specs and versions
const testForAsyncApi2SpecVersion = (src) => {
  const specMatchJson = src.startsWith('asyncapi', 2); // acccount for `"{`
  const specMatchJsonWithWhitespace = src.startsWith('asyncapi', 5); // account for `{  "`
  const specMatchYaml = src.startsWith('asyncapi');
  if (!specMatchJson && !specMatchYaml && !specMatchJsonWithWhitespace) {
    return false;
  }
  // starts with, but is not `n.x.y` exactly
  // may want to gate against `n.z.z`, e.g. (OAS) `3.0.x` and exclude `3.1.x`
  const pos = src.indexOf('2.');
  if ((specMatchJson || specMatchYaml) && pos > 9 && pos < 12) {
    // expect pos = 10, but perhaps some input string variance with spaces
    return true;
  }
  if (specMatchJsonWithWhitespace && pos > 16 && pos < 19) {
    // expect pos = 17, but perhaps some input string variance with spaces
    return true;
  }
  return false;
};

const testForOas3_1SpecVersion = (src) => {
  const specMatchJson = src.startsWith('openapi', 2); // account for `"{`
  const specMatchJsonWithWhitespace = src.startsWith('openapi', 5); // account for `{  "`
  const specMatchYaml = src.startsWith('openapi');
  if (!specMatchJson && !specMatchYaml && !specMatchJsonWithWhitespace) {
    return false;
  }
  // starts with, but is not `n.x.y` exactly
  // may want to gate against `n.z.z`, e.g. (OAS) `3.0.x` and exclude `3.1.x`
  const pos = src.indexOf('3.1.');
  if ((specMatchJson || specMatchYaml) && pos > 8 && pos < 12) {
    // expect pos = 9, but perhaps some input string variance with spaces
    return true;
  }
  if (specMatchJsonWithWhitespace && pos > 15 && pos < 18) {
    // expect pos = 16, but perhaps some input string variance with spaces
    return true;
  }
  return false;
};

// currently matching swagger-editor@3 use of flags.
// extendable to use additional spec versions/types.
export const getSpecVersion = (system) => {
  const { specSelectors } = system;

  // specSelectors can sometimes return undefined
  const isOAS3 = specSelectors.isOAS3() || false;
  const isSwagger2 = specSelectors.isSwagger2() || false;
  // just validating first part of potentially very long string
  const editorContent = specSelectors.specStr().substring(0, 20) || '';
  const isAsyncApi2 = testForAsyncApi2SpecVersion(editorContent) || false;
  const isOAS3_1 = testForOas3_1SpecVersion(editorContent) || false;
  return { isOAS3, isOAS3_1, isSwagger2, isAsyncApi2 };
};

export default { getSpecVersion };
