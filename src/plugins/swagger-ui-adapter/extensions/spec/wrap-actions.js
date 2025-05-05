// eslint-disable-next-line import/prefer-default-export
export const updateSpec = (oriAction, system) => (spec) => {
  const { editorActions } = system;

  oriAction(spec);
  editorActions.detectContentType(spec, system);
};
