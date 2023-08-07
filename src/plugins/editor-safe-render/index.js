import SwaggerUI from 'swagger-ui-react';

import ErrorBoundaryWrapper from './wrap-components/ErrorBoundaryWrapper.jsx';

/**
 * This is special version of SwaggerUI.plugins.SafeRender.
 * In editor context, we want to dismiss the error produced
 * in error boundary if editor content has changed.
 */
const EditorSafeRenderPlugin = () => {
  const safeRenderPlugin = () =>
    SwaggerUI.plugins.SafeRender({
      fullOverride: true,
      componentList: [
        'TopBar',
        'SwaggerEditorLayout',
        'Editor',
        'EditorTextarea',
        'EditorMonaco',
        'EditorPane',
        'EditorPaneBarTop',
        'EditorPreviewPane',
        'ValidationPane',
        'AlertDialog',
        'ConfirmDialog',
        'Dropzone',
      ],
    });

  const safeRenderPluginOverride = () => ({
    wrapComponents: {
      ErrorBoundary: ErrorBoundaryWrapper,
    },
  });

  return [safeRenderPlugin, safeRenderPluginOverride];
};

export default EditorSafeRenderPlugin;
