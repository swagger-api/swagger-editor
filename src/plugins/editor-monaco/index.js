import MonacoEditorContainer from './components/MonacoEditor/MonacoEditorContainer.jsx';
import ValidationPane from './components/ValidationPane/ValidationPane.jsx';
import ValidationTable from './components/ValidationTable/ValidationTable.jsx';
import ThemeSelectionIcon from './components/ThemeSelectionIcon.jsx';
import EditorPaneBarTopWrapper from './extensions/editor-textarea/wrap-components/EditorPaneBarTopWrapper.jsx';
import EditorPaneBarBottomWrapper from './extensions/editor-textarea/wrap-components/EditorPaneBarBottomWrapper.jsx';
import { appendMarkers } from './actions/append-markers.js';
import { clearMarkers } from './actions/clear-markers.js';
import { setLanguage } from './actions/set-language.js';
import { setMarkers } from './actions/set-markers.js';
import {
  setPosition,
  setPositionStarted,
  setPositionSuccess,
  setPositionFailure,
} from './actions/set-position.js';
import { setTheme } from './actions/set-theme.js';
import { setModelVersionId } from './actions/set-model-version-id.js';
import reducers from './reducers.js';
import {
  selectTheme,
  selectMarkers,
  selectLanguage,
  selectEditor,
  selectEditorWidth,
  selectModelVersionId,
  selectModelAlternativeVersionId,
} from './selectors.js';
import { registerMarkerDataProvider } from './fn.js';
import { monaco, monacoInitializationDeferred } from './root-injects.js';
import afterLoad from './after-load.js';
import seVsDarkTheme from './themes/se-vs-dark.js';
import seVsLightTheme from './themes/se-vs-light.js';

const EditorMonacoPlugin = () => ({
  afterLoad,
  rootInjects: {
    monaco,
    monacoInitializationDeferred: () => monacoInitializationDeferred,
    monacoThemes: {
      seVsDarkTheme,
      seVsLightTheme,
    },
  },
  components: {
    Editor: MonacoEditorContainer,
    MonacoEditor: MonacoEditorContainer,
    ValidationPane,
    ValidationTable,
    ThemeSelection: ThemeSelectionIcon,
  },
  wrapComponents: {
    EditorPaneBarTop: EditorPaneBarTopWrapper,
    EditorPaneBarBottom: EditorPaneBarBottomWrapper,
  },
  statePlugins: {
    editor: {
      actions: {
        setTheme,
        setMarkers,
        appendMarkers,
        clearMarkers,
        setLanguage,
        setModelVersionId,

        setPosition,
        setPositionStarted,
        setPositionSuccess,
        setPositionFailure,
      },
      reducers,
      selectors: {
        selectTheme,
        selectMarkers,
        selectLanguage,
        selectEditor,
        selectEditorWidth,
        selectModelVersionId,
        selectModelAlternativeVersionId,
      },
    },
  },
  fn: {
    registerMarkerDataProvider,
  },
});

export default EditorMonacoPlugin;
