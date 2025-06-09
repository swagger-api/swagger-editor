export const EDITOR_PROP_CHANGED = 'EDITOR_PROP_CHANGED';

export const propChanged = (propName: string, newValue: unknown, oldValue: unknown) => ({
  type: EDITOR_PROP_CHANGED,
  payload: propName,
  meta: { newValue, oldValue },
});
