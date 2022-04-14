export const editorSetup = (oriAction) => (editorInstance, implementation) => {
  oriAction(editorInstance, implementation);

  globalThis.editor = editorInstance;
  globalThis[implementation] = editorInstance;
};

export const editorTearDown = (oriAction) => (editorInstance, implementation) => {
  oriAction(editorInstance, implementation);

  delete globalThis.editor;
  delete globalThis[implementation];
};
