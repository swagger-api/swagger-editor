import { useState, useEffect } from 'react';

export function useLanguageFormat(topbarActions, topbarSelectors) {
  const [languageFormat, setLanguageFormat] = useState('json');

  useEffect(() => {
    const getDefinitionLanguageFormat = async () => {
      const result = await topbarActions.getDefinitionLanguageFormat();
      if (result.languageFormat) {
        setLanguageFormat(result.languageFormat);
      }
    };
    // call the async/await function
    getDefinitionLanguageFormat();
  }, [languageFormat, topbarActions]);

  useEffect(() => {
    const shouldUpdateDefinitionLanguageFormat = async () => {
      const result = topbarSelectors.selectShouldUpdateDefinitionLanguageFormat({
        languageFormat,
      });
      if (result.shouldUpdate && result.languageFormat !== languageFormat) {
        setLanguageFormat(result.languageFormat);
      }
    };
    // call the async/await function
    shouldUpdateDefinitionLanguageFormat();
  });
  return languageFormat;
}

export default { useLanguageFormat };
