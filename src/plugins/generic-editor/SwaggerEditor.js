// Marked for removal
import deepMerge from 'deepmerge';
import SwaggerUI from 'swagger-ui';

import EditorLayout from './layout';
import EditorPlugin from '../monaco';
import SplitPaneModePlugin from '../split-pane-mode';

const plugins = {
  EditorPlugin,
  SplitPaneModePlugin,
};

const defaults = {
  // we have the `dom_id` prop for legacy reasons
  dom_id: '#root', // eslint-disable-line camelcase
  layout: 'EditorLayout',
  presets: [SwaggerUI.presets.apis],
  plugins: Object.values(plugins),
  components: {
    EditorLayout,
  },
  showExtensions: true,
};

export default function SwaggerEditor(options) {
  const mergedOptions = deepMerge(defaults, options);
  mergedOptions.presets = defaults.presets.concat(options.presets || []);
  mergedOptions.plugins = defaults.plugins.concat(options.plugins || []);
  return SwaggerUI(mergedOptions);
}

SwaggerEditor.plugins = plugins;
