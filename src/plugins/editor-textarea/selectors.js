import { initialState } from './reducers.js';

// eslint-disable-next-line import/prefer-default-export
export const selectContent = (state) => state.get('content') || initialState.content;
