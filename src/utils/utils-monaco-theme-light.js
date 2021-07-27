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
      { token: 'keyword', foreground: '#a626a4', fontStyle: 'bold' }, // purple; e.g. externalDocs, tags, paths, swagger
      { token: 'info', foreground: '#a626a4', fontStyle: 'bold' }, // purple keyword
      { token: 'identifier', foreground: '#e45649', fontStyle: 'italic' }, // orange
      { token: 'type', foreground: '#268bd2', fontStyle: 'italic' }, // blue
      { token: 'pathItem', foreground: '268bd2', fontStyle: 'italic' }, // blue
      { token: 'operation', foreground: '268bd2', fontStyle: 'underline' }, // blue
      { token: 'operation.httpMethod-POST', fontStyle: 'bold' },
      { token: 'operation.httpMethod-GET', fontStyle: 'bold' },
      { token: 'version', foreground: '#e45649', fontStyle: 'bold' }, // orange
      { token: 'value', foreground: '#859900' }, // green
      { token: 'value.string', foreground: '#859900' }, // green
      { token: 'value.number', foreground: '#859900', fontStyle: 'bold' }, // green
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
      'editor.background': '#fdf6e3',
      'editor.foreground': '#383a42',
      'editorLineNumber.foreground': '#9D9D9F',
      'editorLineNumber.activeForeground': '#383A42',
    },
  },
};

/**
 * One Light, bg: #fafafa, color: #383a42
 * purple-magenta #a626a4
 * reddish-orange other: #e45649
 * brown numeric: #b76b01
 * green quoted: #50a14f
 * blue: #4078f2
 * grey: #a0a1a7
 */

/**
 * Atom Light, bg: white, color: 555
 * teal: #008080
 * dark blue: #458
 * reddish string/num: #d14
 * brown: #900
 * grey: #999988
 */

/**
 * solarized light, bg: #fdf6e3 color: #657b83 highlight?: #e8e4d9
 * olive green keyword: #859900
 * teal: #2aa198
 * blue: #268bd2
 * purple-magenta: #d33682
 * dark grey string text: #657b83
 * grey: #93a1a1
 */

/**
 * One Dark; bg: #282c34, color: #abb2bf
 * purple keyword: #c678dd
 * blue: #61afef
 * reddish: #e06c75
 * green: #98c379
 * orange: #d19a66
 * grey: #5c6370
 */

/**
 * Atom dark, bg: #1d1f21, color: c5c8c6
 * light blue keyword: #96CBFE
 * olive type (function): #CFCB90
 * tan function: #FFD2A7
 * light purple parameter function, other: #C6C5FE
 * light green quoted: #A8FF60
 * pink numeric & boolean: #FF73FD
 */

/**
 * solarized dark, bg: #002b36 color: #839496 highlight?: #e8e4d9
 * olive green keyword: #859900
 * teal: #2aa198
 * blue: #268bd2
 * purple-magenta: #d33682
 * dark gray? plain text?: #657b83
 * grey: #93a1a1
 */

/**
 * keyword
 * other
 * quoted/string
 * numeric/boolean
 * comment
 * default/unknown color
 */
