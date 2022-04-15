const afterLoad = (system) => {
  const { editorPersistence, specSelectors } = system;

  const specPersisted = editorPersistence.get();
  const isPersisted = specPersisted !== null;

  if (!isPersisted) return; // nothing persisted
  if (specSelectors.specStr() === specPersisted) return; // spec already persisted

  system.specActions.updateSpec(specPersisted);
};

export default afterLoad;
