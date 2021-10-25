import { useState, useEffect } from 'react';

export function useDefinitionLanguage(pluginActions) {
  const [definitionLanguage, setDefinitionLanguage] = useState('oas');

  useEffect(() => {
    const getCurrentDefinitionLanguage = async () => {
      const result = await pluginActions.getIsOasOrAsyncApi2();
      if (result === 'oas') {
        setDefinitionLanguage('oas');
      } else if (result === 'asyncapi2') {
        setDefinitionLanguage('asyncapi2');
      }
    };
    // call the async/await function
    getCurrentDefinitionLanguage();
  }, [definitionLanguage, pluginActions]);

  useEffect(() => {
    const tryUpdateDefinitionLanguage = async () => {
      const result = await pluginActions.shouldUpdateDefinitionLanguage(definitionLanguage);
      if (result.shouldUpdate && result.definitionLanguage !== definitionLanguage) {
        setDefinitionLanguage(result.definitionLanguage);
      }
    };
    // call the async/await function
    tryUpdateDefinitionLanguage();
  });
  return definitionLanguage;
}

export default { useDefinitionLanguage };
