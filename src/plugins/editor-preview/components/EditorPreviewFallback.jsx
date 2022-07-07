const EditorPreviewFallback = () => (
  <div className="swagger-ui">
    <div className="version-pragma">
      <div className="version-pragma__message version-pragma__message--missing">
        <div>
          <h3>Unable to render editor content</h3>
          <p>Content was not recognized as supported language in particular format.</p>
        </div>
      </div>
    </div>
  </div>
);

export default EditorPreviewFallback;
