import SwaggerEditor from './plugins/generic-editor/SwaggerEditor';
import SwaggerEditorStandalonePreset from './plugins/standalone';
// import EditorLayout from './plugins/generic-editor/layout';
import GenericEditorPlugin from './plugins/generic-editor';
// import EditorPlugin from './plugins/monaco';
// import SplitPaneModePlugin from './plugins/split-pane-mode';

const plugins = {
  // EditorPlugin,
  // SplitPaneModePlugin,
  GenericEditorPlugin,
};

const editor = SwaggerEditor({
  layout: 'EditorLayout',
  presets: [SwaggerEditorStandalonePreset],
  // presets: [EditorLayout],
  plugins: Object.values(plugins),
  url: 'https://petstore.swagger.io/v2/swagger.json',
});
window.editor = editor;

const App = editor.getComponent('App', 'root');

export default App;
