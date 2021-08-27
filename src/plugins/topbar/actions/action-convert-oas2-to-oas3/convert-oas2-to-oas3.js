import { defaultFixtures } from '../topbar-actions-fixtures';

// currently re-used
export const getConfigsWithDefaultFallback = (system) => {
  let { swagger2GeneratorUrl, oas3GeneratorUrl, swagger2ConverterUrl } = system.getConfigs();
  if (!swagger2GeneratorUrl) {
    swagger2GeneratorUrl = defaultFixtures.swagger2GeneratorUrl;
  }
  if (!oas3GeneratorUrl) {
    oas3GeneratorUrl = defaultFixtures.oas3GeneratorUrl;
  }
  if (!swagger2ConverterUrl) {
    swagger2ConverterUrl = defaultFixtures.swagger2ConverterUrl;
  }
  return { swagger2GeneratorUrl, oas3GeneratorUrl, swagger2ConverterUrl };
};

export default { getConfigsWithDefaultFallback };
