import SwaggerUI from 'swagger-ui-react';

import ErrorBoundaryWrapper from './extensions/safe-render/wrap-components/ErrorBoundaryWrapper.jsx';

/**
 * This is special version of SwaggerUI.plugins.SafeRender.
 * In editor context, we want to dismiss the error produced
 * in error boundary if editor content has changed.
 */
const EditorSafeRenderPlugin = (opts = {}) => {
  const isCalledWithGetSystem = typeof opts.getSystem === 'function';
  const defaultOptions = { componentList: [], fullOverride: false };
  const options = isCalledWithGetSystem ? defaultOptions : { ...defaultOptions, ...opts };

  const plugin = () => {
    const safeRenderPlugin = () => {
      const defaultComponentList = [
        'TopBar',
        'SwaggerEditorLayout',
        'Editor',
        'TextareaEditor',
        'MonacoEditor',
        'EditorPane',
        'EditorPaneBarTop',
        'EditorPreviewPane',
        'ValidationPane',
        'AlertDialog',
        'ConfirmDialog',
        'Dropzone',
      ];
      const mergedComponentList = options.fullOverride
        ? options.componentList
        : [...defaultComponentList, ...options.componentList];

      return SwaggerUI.plugins.SafeRender({
        fullOverride: true,
        componentList: mergedComponentList,
      });
    };

    const safeRenderPluginOverride = () => ({
      wrapComponents: {
        ErrorBoundary: ErrorBoundaryWrapper,
      },
    });

    return [safeRenderPlugin, safeRenderPluginOverride];
  };

  return isCalledWithGetSystem ? plugin(opts) : plugin;
};

export default EditorSafeRenderPlugin;
