export const EDITOR_SET_MARKERS = 'editor_set_markers';

export const setMarkers = (markers = []) => {
  return {
    type: EDITOR_SET_MARKERS,
    payload: markers,
  };
};
