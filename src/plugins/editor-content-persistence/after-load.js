const afterLoad = (system) => {
  const { editorContentPersistence, editorActions, editorSelectors } = system;

  const contentPersisted = editorContentPersistence.get();
  const isPersisted = contentPersisted !== null;

  if (!isPersisted) return; // nothing persisted
  if (editorSelectors.selectContent() === contentPersisted) return; // content already persisted

  editorActions.setContent(contentPersisted, 'local-storage');
};

export default afterLoad;
