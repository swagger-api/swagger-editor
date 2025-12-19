import themeRules from './theme-rules.ts';

const colors = {
  keyword: '#9A6200',
  value: '#434B4F',
};

export default {
  base: 'vs', // can also be vs-dark or hc-black
  inherit: false, // can also be false to completely replace the builtin rules
  rules: themeRules(colors),
  colors: {
    'editor.background': '#F9F9F9',
    'editor.foreground': '#383a42',
    'editorLineNumber.foreground': '#9D9D9F',
    'editorLineNumber.activeForeground': '#383A42',
    'editorHoverWidget.background': '#F9F9F9',
    'editorHoverWidget.border': '#9D9D9F',
    'minimap.background': '#F9F9F9',
  },
};
