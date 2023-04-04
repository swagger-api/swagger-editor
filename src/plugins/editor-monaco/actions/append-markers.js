export const EDITOR_APPEND_MARKERS = 'editor_append_markers';

export const appendMarkers = (markers = []) => {
  return {
    type: EDITOR_APPEND_MARKERS,
    payload: markers,
  };
};
