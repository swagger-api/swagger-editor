export const EDITOR_SET_MODEL_VERSION_ID = 'EDITOR_SET_MODEL_VERSION_ID';

export const setModelVersionId = (versionId, { alternativeVersionId }) => ({
  type: EDITOR_SET_MODEL_VERSION_ID,
  payload: versionId,
  meta: { alternativeVersionId },
});
