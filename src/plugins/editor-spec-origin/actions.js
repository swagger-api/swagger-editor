export const SPEC_UPDATE_ORIGIN = 'spec_update_spec_origin';

export const updateSpecOrigin = (payload = 'not-editor') => ({
  payload: String(payload),
  type: SPEC_UPDATE_ORIGIN,
});
