// content types the Swagger UI preview renders; shared by the preview and the spec update
// eslint-disable-next-line import/prefer-default-export
export const isContentTypeRenderedBySwaggerUI = (editorSelectors) =>
  editorSelectors.selectIsContentTypeOpenAPI() ||
  editorSelectors.selectIsContentTypeJSONSchema202012();
