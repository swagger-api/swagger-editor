/**
 * This wrapped action makes sure that setting initial definition
 * via `spec` or `url` SwaggerUI option is propagated to editor content.
 */
// eslint-disable-next-line import/prefer-default-export
export const updateSpec = (oriAction, system) => (spec, origin) => {
  const { editorActions, editorSelectors, EditorContentOrigin } = system;

  const fsa = oriAction(spec, origin); // Flux Standard Action(FSA): action objects emitted through redux

  if (origin !== EditorContentOrigin.Editor && editorSelectors.selectContent() !== spec) {
    editorActions.setContent(spec, EditorContentOrigin.Props);
  }

  return fsa;
};
