import createSafeActionWrapper from '../../../../utils/create-safe-action-wrapper.js';

// eslint-disable-next-line import/prefer-default-export
export const setContent = createSafeActionWrapper((oriAction, system) => (content) => {
  const { editorContentPersistence, editorSelectors, EditorContentOrigin } = system;

  const contentOrigin = editorSelectors.selectContentOrigin();

  if (contentOrigin === EditorContentOrigin.Props) {
    editorContentPersistence.remove();
  } else if (contentOrigin !== EditorContentOrigin.InitialFixtureLoad) {
    editorContentPersistence.set(content);
  }
});
