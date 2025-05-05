export const EDITOR_PROP_CHANGED = 'EDITOR_PROP_CHANGED';

export const propChanged = (propName, newValue, oldValue) => ({
  type: EDITOR_PROP_CHANGED,
  payload: propName,
  meta: { newValue, oldValue },
});
