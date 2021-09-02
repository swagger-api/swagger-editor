const editor = {
  create: () => {
    return {
      // methods
      setValue: () => {},
      setTheme: () => {},
      setModelLanguage: () => {},
      getModel: () => {},
      layout: () => {},
      dispose: () => {},
      focus: () => {},
      onDidChangeModelContent: () => {},
      updateOptions: () => {},
    };
  },
};

// const languages = {
//   register: (language) => {},
//   setMonarchTokensProvider: (name, tokens) => {},
//   registerCompletionItemProvider: (name, provider) => {}
// };

const monaco = { editor };

module.exports = monaco;
