import { Action } from 'types/actions';

export const EDITOR_PROP_CHANGED = 'EDITOR_PROP_CHANGED';

export type PropChangedAction = (
  propName: string,
  newValue: unknown,
  oldValue: unknown
) => Action<string, { newValue: unknown; oldValue: unknown }>;

export const propChanged: PropChangedAction = (propName, newValue, oldValue) => ({
  type: EDITOR_PROP_CHANGED,
  payload: propName,
  meta: { newValue, oldValue },
});
