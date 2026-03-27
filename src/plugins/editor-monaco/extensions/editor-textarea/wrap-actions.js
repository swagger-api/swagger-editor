export const editorSetup = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    return oriAction(editorInstance, implementation);
  }

  const fsa = oriAction({ id: editorInstance.getId() }, implementation);

  globalThis.editor = editorInstance;
  globalThis[implementation] = editorInstance;

  return fsa;
};

export const editorTearDown = (oriAction) => (editorInstance, implementation) => {
  if (implementation !== 'monaco') {
    return oriAction(editorInstance, implementation);
  }

  const fsa = oriAction({ id: editorInstance.getId() }, implementation);

  delete globalThis.editor;
  delete globalThis[implementation];

  return fsa;
};
