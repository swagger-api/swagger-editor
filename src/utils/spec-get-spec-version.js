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
  const specMatchYaml = src.startsWith('asyncapi');
  if (!specMatchJson && !specMatchYaml) {
    return false;
  }
  // starts with, but is not `n.x.y` exactly
  // may want to gate against `n.z.z`, e.g. (OAS) `3.0.x` and exclude `3.1.x`
  const pos = src.indexOf('2.');
  if (pos > 9 && pos < 12) {
    // expect pos = 10, but perhaps some input string variance with spaces
    return true;
  }
  return false;
};

const testForOas3_1SpecVersion = (src) => {
  const specMatchJson = src.startsWith('openapi', 2); // acccount for `"{`
  const specMatchYaml = src.startsWith('openapi');
  if (!specMatchJson && !specMatchYaml) {
    return false;
  }
  // starts with, but is not `n.x.y` exactly
  // may want to gate against `n.z.z`, e.g. (OAS) `3.0.x` and exclude `3.1.x`
  const pos = src.indexOf('3.1.');
  if (pos > 8 && pos < 12) {
    // expect pos = 9, but perhaps some input string variance with spaces
    return true;
  }
  return false;
};

// Todo: could be refactored/optimized to not need `specSelectors`
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

// reference example Swagger UI selectors, which also rely on immutableJS
// export function isOAS3(jsSpec) {
//   const oasVersion = jsSpec.get('openapi');
//   if (typeof oasVersion !== 'string') {
//     return false;
//   }

//   // we gate against `3.1` becasue we want to explicitly opt into supporting it
//   // at some point in the future -- KS, 7/2018

//   // starts with, but is not `3.0.` exactly
//   return oasVersion.startsWith('3.0.') && oasVersion.length > 4;
// }

// export function isSwagger2(jsSpec) {
//   const swaggerVersion = jsSpec.get('swagger');
//   if (typeof swaggerVersion !== 'string') {
//     return false;
//   }

//   return swaggerVersion.startsWith('2.0');
// }
