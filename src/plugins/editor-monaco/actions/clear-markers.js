export const EDITOR_CLEAR_MARKERS = 'editor_clear_markers';

export const clearMarkers = (source = 'apilint') => {
  return {
    type: EDITOR_CLEAR_MARKERS,
    payload: source,
  };
};
