/**
 * Action types.
 */
export const EDITOR_CONTENT_SET_READ_ONLY = 'editor_update_read_only';
export const EDITOR_CONTENT_SET_READ_WRITE = 'editor_update_read_write';

/**
 * Action creators.
 */
export const setContentReadOnly = () => ({
  type: EDITOR_CONTENT_SET_READ_ONLY,
});

export const setContentReadWrite = () => ({
  type: EDITOR_CONTENT_SET_READ_WRITE,
});
