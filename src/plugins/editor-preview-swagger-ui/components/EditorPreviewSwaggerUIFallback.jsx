const EditorPreviewSwaggerUIFallback = () => (
  <div className="swagger-editor__editor-preview-fallback swagger-ui">
    <div className="version-pragma">
      <div className="version-pragma__message">
        <div>
          <h3>Unable to render editor content</h3>
          <p>
            SwaggerUI does not currently support rendering of OpenAPI 3.1 definitions.
            <p>
              It is in the SwaggerUI roadmap to fully support rendering of OpenAPI 3.1 definitions.
              For additional information, please refer to this Github{' '}
              <a href="https://github.com/swagger-api/swagger-ui/issues/5891">issue</a>.
            </p>
          </p>
          <p>
            However, SwaggerEditor itself does support OpenAPI 3.1 within its editing experience.
            This includes OpenAPI 3.1 validation rules and semantic highlighting.
          </p>
          <p>
            Thus, you may continue to write and update your OpenAPI 3.1 definitions with confidence
            in conformance to the OpenAPI 3.1 specification.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default EditorPreviewSwaggerUIFallback;
