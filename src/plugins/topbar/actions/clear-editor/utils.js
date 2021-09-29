/* eslint-disable camelcase */
import {
  mockOas3Spec,
  mockAsyncapi2Spec,
  mockOas2Spec,
  mockOas3_1Spec,
} from '../topbar-actions-fixtures';

// eslint-disable-next-line camelcase
export const getInitialDefinitionObj = ({ isOAS3, isSwagger2, isOAS3_1, isAsyncApi2 }) => {
  // assumes at least 1 arg is true
  let content;
  if (isOAS3) {
    content = mockOas3Spec;
  }
  // eslint-disable-next-line camelcase
  if (isOAS3_1) {
    // eslint-disable-next-line camelcase
    content = mockOas3_1Spec;
  }
  if (isAsyncApi2) {
    content = mockAsyncapi2Spec;
  }
  if (isSwagger2) {
    content = mockOas2Spec;
  }
  return content;
};

export default { getInitialDefinitionObj };
