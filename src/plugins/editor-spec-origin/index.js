const SPEC_UPDATE_ORIGIN = 'spec_update_spec_origin';

// wraps updateSpec to include the "origin" parameter, defaulting to "not-editor"
// Includes a selector to get the origin, specSelectors.specOrigin
export default function EditorSpecOriginPlugin() {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec: (ori, system) => (specStr, origin) => {
            system.specActions.updateSpecOrigin(origin);
            ori(specStr);
          },
        },
        reducers: {
          [SPEC_UPDATE_ORIGIN]: (state, action) => {
            return state.set('specOrigin', action.payload);
          },
        },
        selectors: {
          specOrigin: (state) => state.get('specOrigin') || 'not-editor',
        },
        actions: {
          updateSpecOrigin(origin = 'not-editor') {
            return {
              payload: `${origin}`,
              type: SPEC_UPDATE_ORIGIN,
            };
          },
        },
      },
    },
  };
}
