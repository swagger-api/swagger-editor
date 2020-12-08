import EditorLayout from './layout';
// import EditorPlugin from '../monaco';
// import SplitPaneModePlugin from '../split-pane-mode';

const GenericEditorPlugin = () => ({
  statePlugin: {
    genericEditor: {},
  },
  components: {
    EditorLayout,
    // EditorPlugin,
    // SplitPaneModePlugin,
  },
  // plugins: [EditorPlugin, SplitPaneModePlugin],
});

export default GenericEditorPlugin;

// import deepMerge from 'deepmerge';
// import SwaggerUI from 'swagger-ui-react';
// // import SwaggerUI from 'swagger-ui';

// const plugins = {
//   EditorPlugin,
//   SplitPaneModePlugin,
// };

// const defaults = {
//   // we have the `dom_id` prop for legacy reasons
//   dom_id: '#root', // eslint-disable-line camelcase
//   layout: 'EditorLayout',
//   // presets: [SwaggerUI.presets.apis], // only with swagger-ui, not swagger-ui-react
//   presets: [],
//   plugins: Object.values(plugins),
//   components: {
//     EditorLayout,
//   },
//   showExtensions: true,
// };

// export function buildSwaggerEditor(options) {
//   console.log('options to merge:', options);
//   const mergedOptions = deepMerge(defaults, options);
//   mergedOptions.presets = defaults.presets.concat(options.presets || []);
//   mergedOptions.plugins = defaults.plugins.concat(options.plugins || []);
//   console.log('merged options:', mergedOptions);
//   // return SwaggerUI(...mergedOptions);
//   return mergedOptions;
// }

// SwaggerEditor.plugins = plugins;
