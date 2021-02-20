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
