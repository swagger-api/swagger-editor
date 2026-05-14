export const editorSetup = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    return oriAction(editorInstance, implementation);
  }

  globalThis.editor = editorInstance;
  globalThis[implementation] = editorInstance;

  return oriAction({ id: editorInstance.getId() }, implementation);
};

export const editorTearDown = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    return oriAction(editorInstance, implementation);
  }

  delete globalThis.editor;
  delete globalThis[implementation];

  return oriAction({ id: editorInstance.getId() }, implementation);
};
