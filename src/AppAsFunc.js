import SwaggerEditor from './plugins/generic-editor/SwaggerEditor';
import SwaggerEditorStandalonePreset from './plugins/standalone';

const editor = SwaggerEditor({
  layout: 'StandaloneLayout',
  presets: [SwaggerEditorStandalonePreset],
});
window.editor = editor;

const App = editor.getComponent('App', 'root');

export default App;
