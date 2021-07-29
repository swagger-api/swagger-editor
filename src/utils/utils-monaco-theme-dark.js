const darkThemeMap = {
  keyword: 12,
  comment: 7,
  parameter: 6,
  property: 14,
  label: 16,
  class: 3,
  macro: 11,
  string: 5,
  variable: {
    declaration: 8,
    definition: 8,
    deprecated: 8,
    reference: 4,
  },
  operator: 1,
  specVersion: 7,
  version: 14,
  info: 6,
  // 'operation': 12,
  operation: {
    'httpMethod-GET': 12,
    'httpMethod-POST': 8,
  },
  pathItem: 11,
  key: {
    string: 5,
    number: 6,
  },
  value: {
    string: 16,
    number: 6,
  },
  number: 6,
};

// TS
// function getStyleMetadataDark(type: string, modifiers: string[]) {
//   let color = (darkThemeMap as any)[type];
//   if (type === "variable") {
//     color = (darkThemeMap[type] as any)[modifiers[0]];
//   }
//   if (type === "operation" || type === "key" || type === "value") {
//     color = (darkThemeMap[type] as any)[modifiers[0]];
//   }
//   const style = {
//     foreground: color,
//     bold: false,
//     underline: false,
//     italic: false
//   };
//   if (true) {
//     return style;
//   }
// };

export default function getStyleMetadataDark(type, modifiers) {
  let color = darkThemeMap[type];
  if (type === 'variable') {
    color = darkThemeMap[type][modifiers[0]];
  }
  if (type === 'operation' || type === 'key' || type === 'value') {
    color = darkThemeMap[type][modifiers[0]];
  }
  const style = {
    foreground: color,
    bold: false,
    underline: false,
    italic: false,
  };
  return style;
}

// After creating editor in component, where 'monaco' is a loaded import,
// monaco.editor.setTheme('vs-dark');
// editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataDark

export const themes = {
  seVsDark: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '#C678DD', fontStyle: 'bold' }, // atom purple; e.g. externalDocs, tags, paths, swagger
      { token: 'info', foreground: '#C678DD', fontStyle: 'bold' }, // atom purple keyword
      { token: 'identifier', foreground: '#D19A66', fontStyle: 'italic' }, // atom orange
      { token: 'type', foreground: '#61AFEF', fontStyle: 'italic' }, // atom blue
      { token: 'pathItem', foreground: '66afce', fontStyle: 'italic' }, // light blue
      { token: 'operation', foreground: '66afce', fontStyle: 'underline' }, // light blue
      { token: 'operation.httpMethod-POST', fontStyle: 'bold' },
      { token: 'operation.httpMethod-GET', fontStyle: 'bold' },
      { token: 'version', foreground: '#D19A66', fontStyle: 'bold' }, // atom orange
      { token: 'value', foreground: '#98C379' }, // green
      { token: 'value.string', foreground: '#98C379' }, // green
      { token: 'value.number', foreground: '#98C379', fontStyle: 'bold' }, // green
      // response codes, comments, colons/slashes, are interpreted as 'invalid'
      // { token: 'comment', foreground: '5c6370', fontStyle: 'italic' }, // atom grey
      // { token: 'identifier.version', foreground: '#D19A66', fontStyle: 'italic' }, // atom orange
      // { token: 'parameter', foreground: '#98C379', fontStyle: 'bold' }, // green
      // { token: 'property', foreground: '#98C379', fontStyle: 'bold' }, // green
      // { token: 'label', foreground: '#98C379', fontStyle: 'italic' }, // green
      // { token: 'class', foreground: '#98C379', fontStyle: 'italic' }, // green
      // { token: 'macro', foreground: '#98C379' }, // green
      // { token: 'operator', foreground: '#98C379' }, // green
      // { token: 'specVersion', foreground: '#98C379' }, // green
      // { token: 'string', foreground: '#98C379' }, // green
      // { token: 'variable', foreground: '#98C379' }, // green
      // { token: 'variable.declaration', foreground: '#98C379' }, // green
      // { token: 'variable.definition', foreground: '#98C379' }, // green
      // { token: 'variable.deprecated', foreground: '#98C379' }, // green
      // { token: 'variable.reference', foreground: '#98C379', fontStyle: 'bold' }, // green
      // { token: 'key', foreground: '#98C379' }, // green
      // { token: 'key.string', foreground: '#98C379' }, // green
      // { token: 'key.number', foreground: '#98C379', fontStyle: 'bold' }, // green
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editorLineNumber.foreground': '#636D83',
      'editorLineNumber.activeForeground': '#ABB2BF',
      'editorHoverWidget.background': '#282c34',
      'editorHoverWidget.border': '#636D83',
      'minimap.background': '#282c34',
    },
  },
};
