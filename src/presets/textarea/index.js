import LayoutPlugin from 'plugins/layout/index.js';
import SplashScreenPlugin from 'plugins/splash-screen/index.js';
import TopBarPlugin from 'plugins/top-bar/index.js';
import ModalsPlugin from 'plugins/modals/index.js';
import DialogsPlugin from 'plugins/dialogs/index.js';
import DropdownMenuPlugin from 'plugins/dropdown-menu/index.js';
import DropzonePlugin from 'plugins/dropzone/index.js';
import VersionsPlugin from 'plugins/versions/index.js';
import EditorTextareaPlugin from 'plugins/editor-textarea/index.js';
import EditorPreviewPlugin from 'plugins/editor-preview/index.js';
import EditorPreviewSwaggerUIPlugin from 'plugins/editor-preview-swagger-ui/index.js';
import EditorPreviewAsyncAPIPlugin from 'plugins/editor-preview-asyncapi/index.js';
import EditorPreviewApiDesignSystemsPlugin from 'plugins/editor-preview-api-design-systems/index.js';
import EditorContentReadOnlyPlugin from 'plugins/editor-content-read-only/index.js';
import EditorContentOriginPlugin from 'plugins/editor-content-origin/index.js';
import EditorContentTypePlugin from 'plugins/editor-content-type/index.js';
import EditorContentPersistencePlugin from 'plugins/editor-content-persistence/index.js';
import EditorContentFixturesPlugin from 'plugins/editor-content-fixtures/index.js';
import EditorContentFromFilePlugin from 'plugins/editor-content-from-file/index.js';
import EditorSafeRenderPlugin from 'plugins/editor-safe-render/index.js';
import UtilPlugin from 'plugins/util/index.js';

const TextareaPreset = () => [
  UtilPlugin,
  ModalsPlugin,
  DialogsPlugin,
  DropdownMenuPlugin,
  DropzonePlugin,
  VersionsPlugin,
  EditorTextareaPlugin,
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

export default TextareaPreset;
