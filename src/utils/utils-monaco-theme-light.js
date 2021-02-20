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
