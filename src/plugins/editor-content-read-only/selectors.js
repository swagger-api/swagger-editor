export const selectContentIsReadOnly = (state) => state.get('contentIsReadOnly') || false;

export const selectContentIsReadWrite = (state) => !selectContentIsReadOnly(state);
