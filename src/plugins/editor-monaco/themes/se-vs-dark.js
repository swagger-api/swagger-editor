import themeRules from './theme-rules.ts';

const colors = {
  keyword: '#CB973C',
  value: '#EAEBEB',
};

export default {
  base: 'vs-dark',
  inherit: false,
  rules: themeRules(colors),
  colors: {
    'editor.background': '#282c34',
    'editor.foreground': '#abb2bf',
    'editorLineNumber.foreground': '#636D83',
    'editorLineNumber.activeForeground': '#ABB2BF',
    'editorHoverWidget.background': '#282c34',
    'editorHoverWidget.border': '#636D83',
    'minimap.background': '#282c34',
  },
};
