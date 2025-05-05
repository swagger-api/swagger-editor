import ModalsPlugin from 'plugins/modals/index.js';
import DialogsPlugin from 'plugins/dialogs/index.js';
import DropdownMenuPlugin from 'plugins/dropdown-menu/index.js';
import DropzonePlugin from 'plugins/dropzone/index.js';
import VersionsPlugin from 'plugins/versions/index.js';
import EditorTextareaPlugin from 'plugins/editor-textarea/index.js';
import EditorMonacoPlugin from 'plugins/editor-monaco/index.js';
import EditorMonacoLanguageApiDOMPlugin from 'plugins/editor-monaco-language-apidom/index.js';
import EditorMonacoYamlPastePlugin from 'plugins/editor-monaco-yaml-paste/index.js';
import EditorContentReadOnlyPlugin from 'plugins/editor-content-read-only/index.js';
import EditorContentOriginPlugin from 'plugins/editor-content-origin/index.js';
import EditorContentTypePlugin from 'plugins/editor-content-type/index.js';
import EditorContentPersistencePlugin from 'plugins/editor-content-persistence/index.js';
import EditorContentFixturesPlugin from 'plugins/editor-content-fixtures/index.js';
import EditorContentFromFilePlugin from 'plugins/editor-content-from-file/index.js';
import EditorPreviewPlugin from 'plugins/editor-preview/index.js';
import EditorPreviewSwaggerUIPlugin from 'plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from 'plugins/editor-preview-asyncapi/index.js';
import EditorPreviewApiDesignSystemsPlugin from 'plugins/editor-preview-api-design-systems/index.js';
import TopBarPlugin from 'plugins/top-bar/index.js';
import SplashScreenPlugin from 'plugins/splash-screen/index.js';
import LayoutPlugin from 'plugins/layout/index.js';
import EditorSafeRenderPlugin from 'plugins/editor-safe-render/index.js';
import UtilPlugin from 'plugins/util/index.js';

const MonacoPreset = () => [
  UtilPlugin,
  ModalsPlugin,
  DialogsPlugin,
  DropdownMenuPlugin,
  DropzonePlugin,
  VersionsPlugin,
  EditorTextareaPlugin,
  EditorMonacoPlugin,
  EditorMonacoLanguageApiDOMPlugin,
  EditorMonacoYamlPastePlugin,
  EditorContentReadOnlyPlugin,
  EditorContentOriginPlugin,
  EditorContentTypePlugin,
  EditorContentPersistencePlugin,
  EditorContentFixturesPlugin,
  EditorContentFromFilePlugin,
  EditorPreviewPlugin,
  EditorPreviewSwaggerUIPlugin,
  EditorPreviewAsyncAPIPlugin,
  EditorPreviewApiDesignSystemsPlugin,
  TopBarPlugin,
  SplashScreenPlugin,
  LayoutPlugin,
  EditorSafeRenderPlugin,
];

export default MonacoPreset;
