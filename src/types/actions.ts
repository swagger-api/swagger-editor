export type AnyAction<T extends string = string> = {
  type: T;
};

export interface Action<
  Payload,
  Meta extends Record<string, unknown> | unknown[] | undefined = undefined,
> extends AnyAction {
  type: string;
  payload: Payload;
  error?: boolean;
  meta?: Meta;
}
