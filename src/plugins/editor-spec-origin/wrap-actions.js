// eslint-disable-next-line import/prefer-default-export
export const updateSpec = (oriAction, system) => (specStr, origin) => {
  oriAction(specStr);
  system.specActions.updateSpecOrigin(origin);
};
