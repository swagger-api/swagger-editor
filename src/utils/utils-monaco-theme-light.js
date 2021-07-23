const lightThemeMap = {
  keyword: 0,
  comment: 7,
  parameter: 5,
  property: 4,
  label: 11,
  class: 5,
  macro: 3,
  string: 11,
  variable: {
    declaration: 12,
    definition: 12,
    deprecated: 12,
    reference: 13,
  },
  operator: 1,
  specVersion: 7,
  version: 4,
  info: 5,
  // 'operation': 0,
  operation: {
    'httpMethod-GET': 13,
    'httpMethod-POST': 12,
  },
  pathItem: 3,
  key: {
    string: 11,
    number: 5,
  },
  value: {
    string: 5,
    number: 4,
  },
  number: 4,
};

// TS
// function getStyleMetadataLight(type: string, modifiers: string[]) {
//   let color = (lightThemeMap as any)[type];
//   if (type === "variable") {
//     color = (lightThemeMap[type] as any)[modifiers[0]];
//   }
//   if (type === "operation" || type === "key" || type === "value") {
//     color = (lightThemeMap[type] as any)[modifiers[0]];
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

export default function getStyleMetadataLight(type, modifiers) {
  let color = lightThemeMap[type];
  if (type === 'variable') {
    color = lightThemeMap[type][modifiers[0]];
  }
  if (type === 'operation' || type === 'key' || type === 'value') {
    color = lightThemeMap[type][modifiers[0]];
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
// monaco.editor.setTheme('vs');
// editor._themeService._theme.getTokenStyleMetadata = getStyleMetadataLight;

export const themes = {
  seVsLight: {
    base: 'vs', // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
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
      'editor.background': '#FAFAFA',
      'editor.foreground': '#383a42',
      'editorLineNumber.foreground': '#9D9D9F',
      'editorLineNumber.activeForeground': '#383A42',
    },
  },
};
