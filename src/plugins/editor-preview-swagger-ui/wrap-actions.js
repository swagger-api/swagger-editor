import { createSafeActionWrapper } from '../util/fn.js';

export const previewUnmounted = createSafeActionWrapper((oriAction, system) => () => {
  system.specActions.updateUrl('');
  system.specActions.updateSpec('', system.EditorContentOrigin.Editor);
});

export const jumpToPathSuccess = createSafeActionWrapper((oriAction, system) => ({ path }) => {
  const { authActions } = system;
  const isAuthPath =
    path[0] === 'securityDefinitions' ||
    (path[0] === 'components' && path[1] === 'securitySchemes');

  if (isAuthPath) {
    authActions.showDefinitions(false);
  }
});
