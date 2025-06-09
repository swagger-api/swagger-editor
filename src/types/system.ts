export interface GetSystemValues {
  getComponent: () => void;
  editorSelectors: {
    selectContent: () => unknown;
    selectInferFileNameWithExtensionFromContent: () => unknown;
  };
  editorActions: {
    convertContentToJSON: () => void;
    setContent: (content: unknown) => void;
    propChanged: (spec: string, oldValue: unknown, newValue: unknown) => void;
  };
  EditorContentOrigin: {
    Conversion: string;
  };
}

export interface System {
  getSystem: () => GetSystemValues;
}
