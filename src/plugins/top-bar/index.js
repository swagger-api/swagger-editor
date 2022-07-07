import TopBar from './components/TopBar/TopBar.jsx';
import Logo from './components/Logo/Logo.jsx';
import FileMenu from './components/FileMenu/FileMenu.jsx';
import ImportUrlMenuItem from './components/FileMenu/items/ImportUrlMenuItem.jsx';
import ImportFileMenuItem from './components/FileMenu/items/ImportFileMenuItem.jsx';
import SaveAsMenuItem from './components/FileMenu/items/SaveAsMenuItem.jsx';
import ConvertAndSaveAsJSONMenuItem from './components/FileMenu/items/ConvertAndSaveAsJSONMenuItem.jsx';
import ConvertAndSaveAsYAMLMenuItem from './components/FileMenu/items/ConvertAndSaveAsYAMLMenuItem.jsx';
import DownloadResolvedJSONMenuItem from './components/FileMenu/items/DownloadResolvedJSONMenuItem.jsx';
import DownloadResolvedYAMLMenuItem from './components/FileMenu/items/DownloadResolvedYAMLMenuItem.jsx';
import EditMenu from './components/EditMenu/EditMenu.jsx';
import ClearMenuItem from './components/EditMenu/items/ClearMenuItem.jsx';
import ConvertToJSONMenuItem from './components/EditMenu/items/ConvertToJSONMenuItem.jsx';
import ConvertToYAMLMenuItem from './components/EditMenu/items/ConvertToYAMLMenuItem.jsx';
import ConvertToOpenAPI30xMenuItem from './components/EditMenu/items/ConvertToOpenAPI30xMenuItem.jsx';
import LoadAsyncAPI24FixtureMenuItem from './components/EditMenu/items/LoadAsyncAPI24FixtureMenuItem.jsx';
import LoadAsyncAPI24PetstoreFixtureMenuItem from './components/EditMenu/items/LoadAsyncAPI24PetstoreFixtureMenuItem.jsx';
import LoadOpenAPI20FixtureMenuItem from './components/EditMenu/items/LoadOpenAPI20FixtureMenuItem.jsx';
import LoadOpenAPI30FixtureMenuItem from './components/EditMenu/items/LoadOpenAPI30FixtureMenuItem.jsx';
import LoadOpenAPI31FixtureMenuItem from './components/EditMenu/items/LoadOpenAPI31FixtureMenuItem.jsx';
import OpenAPI3GenerateServerMenu from './components/GenerateServerMenu/OpenAPI3GenerateServerMenu.jsx';
import OpenAPI3GenerateClientMenu from './components/GenerateServerMenu/OpenAPI3GenerateClientMenu.jsx';
import OpenAPI2GenerateServerMenu from './components/GenerateServerMenu/OpenAPI2GenerateServerMenu.jsx';
import OpenAPI2GenerateClientMenu from './components/GenerateServerMenu/OpenAPI2GenerateClientMenu.jsx';
import {
  importUrlStarted,
  importUrlSuccess,
  importUrlFailure,
  importUrl,
} from './actions/import-url.js';
import {
  downloadContent,
  downloadContentStarted,
  downloadContentSuccess,
  downloadContentFailure,
} from './actions/download-content.js';
import {
  convertContentToJSON,
  convertContentToJSONStarted,
  convertContentToJSONSuccess,
  convertContentToJSONFailure,
} from './actions/convert-content-to-json.js';
import {
  convertContentToYAML,
  convertContentToYAMLStarted,
  convertContentToYAMLSuccess,
  convertContentToYAMLFailure,
} from './actions/convert-content-to-yaml.js';
import {
  dereferenceContent,
  dereferenceContentStarted,
  dereferenceContentSuccess,
  dereferenceContentFailure,
} from './actions/dereference-content.js';
import {
  convertOpenAPI20ToOpenAPI30x,
  convertOpenAPI20ToOpenAPI30xStarted,
  convertOpenAPI20ToOpenAPI30xSuccess,
  convertOpenAPI20ToOpenAPI30xFailure,
} from './actions/convert-openapi-20-to-openapi-30x.js';
import {
  fetchOpenAPI3GeneratorServerList,
  fetchOpenAPI3GeneratorServerListStarted,
  fetchOpenAPI3GeneratorServerListSuccess,
  fetchOpenAPI3GeneratorServerListFailure,
} from './actions/fetch-openapi3-generator-server-list.js';
import {
  fetchOpenAPI3GeneratorClientList,
  fetchOpenAPI3GeneratorClientListStarted,
  fetchOpenAPI3GeneratorClientListSuccess,
  fetchOpenAPI3GeneratorClientListFailure,
} from './actions/fetch-openapi3-generator-client-list.js';
import {
  fetchOpenAPI2GeneratorServerList,
  fetchOpenAPI2GeneratorServerListStarted,
  fetchOpenAPI2GeneratorServerListSuccess,
  fetchOpenAPI2GeneratorServerListFailure,
} from './actions/fetch-openapi2-generator-server-list.js';
import {
  fetchOpenAPI2GeneratorClientList,
  fetchOpenAPI2GeneratorClientListStarted,
  fetchOpenAPI2GeneratorClientListSuccess,
  fetchOpenAPI2GeneratorClientListFailure,
} from './actions/fetch-openapi2-generator-client-list.js';
import {
  generateServerCodeFromOpenAPI3,
  generateServerCodeFromOpenAPI3Started,
  generateServerCodeFromOpenAPI3Success,
  generateServerCodeFromOpenAPI3Failure,
} from './actions/generate-server-code-from-openapi-3.js';
import {
  generateClientCodeFromOpenAPI3,
  generateClientCodeFromOpenAPI3Started,
  generateClientCodeFromOpenAPI3Success,
  generateClientCodeFromOpenAPI3Failure,
} from './actions/generate-client-code-from-openapi-3.js';
import {
  generateServerCodeFromOpenAPI20,
  generateServerCodeFromOpenAPI20Started,
  generateServerCodeFromOpenAPI20Success,
  generateServerCodeFromOpenAPI20Failure,
} from './actions/generate-server-code-from-openapi-20.js';
import {
  generateClientCodeFromOpenAPI20,
  generateClientCodeFromOpenAPI20Started,
  generateClientCodeFromOpenAPI20Success,
  generateClientCodeFromOpenAPI20Failure,
} from './actions/generate-client-code-from-openapi-20.js';
import { detectContentTypeSuccess as detectContentTypeSuccessWrap } from './wrap-actions.js';
import {
  selectOpenAPI20ConverterURL,
  selectOpenAPI3GeneratorServerListURL,
  selectOpenAPI3GenerateServerURL,
  selectOpenAPI3GeneratorServerListStatus,
  selectOpenAPI3GeneratorServerList,
  selectOpenAPI3GeneratorClientListURL,
  selectOpenAPI3GenerateClientURL,
  selectOpenAPI3GeneratorClientListStatus,
  selectOpenAPI3GeneratorClientList,
  selectOpenAPI2GeneratorServerListURL,
  selectOpenAPI2GenerateServerURL,
  selectOpenAPI2GeneratorServerListStatus,
  selectOpenAPI2GeneratorServerList,
  selectOpenAPI2GeneratorClientListURL,
  selectOpenAPI2GenerateClientURL,
  selectOpenAPI2GeneratorClientListStatus,
  selectOpenAPI2GeneratorClientList,
} from './selectors.js';
import reducers from './reducers.js';

const TopBarPlugin = () => ({
  components: {
    TopBar,
    TopBarLogo: Logo,

    TopBarFileMenu: FileMenu,
    TopBarFileMenuImportUrlMenuItem: ImportUrlMenuItem,
    TopBarFileMenuImportFileMenuItem: ImportFileMenuItem,
    TopBarFileMenuSaveAsMenuItem: SaveAsMenuItem,
    TopBarFileMenuConvertAndSaveAsJSONMenuItem: ConvertAndSaveAsJSONMenuItem,
    TopBarFileMenuConvertAndSaveAsYAMLMenuItem: ConvertAndSaveAsYAMLMenuItem,
    TopBarFileMenuDownloadResolvedJSONMenuItem: DownloadResolvedJSONMenuItem,
    TopBarFileMenuDownloadResolvedYAMLMenuItem: DownloadResolvedYAMLMenuItem,

    TopBarEditMenu: EditMenu,
    TopBarEditMenuClearMenuItem: ClearMenuItem,
    TopBarEditMenuConvertToJSONMenuItem: ConvertToJSONMenuItem,
    TopBarEditMenuConvertToYAMLMenuItem: ConvertToYAMLMenuItem,
    TopBarEditMenuConvertToOpenAPI30xMenuItem: ConvertToOpenAPI30xMenuItem,
    TopBarEditMenuLoadAsyncAPI24FixtureMenuItem: LoadAsyncAPI24FixtureMenuItem,
    TopBarEditMenuLoadAsyncAPI24PetstoreFixtureMenuItem: LoadAsyncAPI24PetstoreFixtureMenuItem,
    TopBarEditMenuLoadOpenAPI20FixtureMenuItem: LoadOpenAPI20FixtureMenuItem,
    TopBarEditMenuLoadOpenAPI30FixtureMenuItem: LoadOpenAPI30FixtureMenuItem,
    TopBarEditMenuLoadOpenAPI31FixtureMenuItem: LoadOpenAPI31FixtureMenuItem,

    TopBarOpenAPI3GenerateServerMenu: OpenAPI3GenerateServerMenu,
    TopBarOpenAPI3GenerateClientMenu: OpenAPI3GenerateClientMenu,

    TopBarOpenAPI2GenerateServerMenu: OpenAPI2GenerateServerMenu,
    TopBarOpenAPI2GenerateClientMenu: OpenAPI2GenerateClientMenu,
  },
  statePlugins: {
    editor: {
      actions: {
        importUrl,
        importUrlStarted,
        importUrlSuccess,
        importUrlFailure,

        downloadContent,
        downloadContentStarted,
        downloadContentSuccess,
        downloadContentFailure,

        convertContentToJSON,
        convertContentToJSONStarted,
        convertContentToJSONSuccess,
        convertContentToJSONFailure,

        convertContentToYAML,
        convertContentToYAMLStarted,
        convertContentToYAMLSuccess,
        convertContentToYAMLFailure,

        dereferenceContent,
        dereferenceContentStarted,
        dereferenceContentSuccess,
        dereferenceContentFailure,

        convertOpenAPI20ToOpenAPI30x,
        convertOpenAPI20ToOpenAPI30xStarted,
        convertOpenAPI20ToOpenAPI30xSuccess,
        convertOpenAPI20ToOpenAPI30xFailure,
      },
      wrapActions: {
        detectContentTypeSuccess: detectContentTypeSuccessWrap,
      },
      selectors: {
        selectOpenAPI20ConverterURL,
      },
    },
    editorTopBar: {
      actions: {
        fetchOpenAPI3GeneratorServerList,
        fetchOpenAPI3GeneratorServerListStarted,
        fetchOpenAPI3GeneratorServerListSuccess,
        fetchOpenAPI3GeneratorServerListFailure,

        fetchOpenAPI3GeneratorClientList,
        fetchOpenAPI3GeneratorClientListStarted,
        fetchOpenAPI3GeneratorClientListSuccess,
        fetchOpenAPI3GeneratorClientListFailure,

        fetchOpenAPI2GeneratorServerList,
        fetchOpenAPI2GeneratorServerListStarted,
        fetchOpenAPI2GeneratorServerListSuccess,
        fetchOpenAPI2GeneratorServerListFailure,

        fetchOpenAPI2GeneratorClientList,
        fetchOpenAPI2GeneratorClientListStarted,
        fetchOpenAPI2GeneratorClientListSuccess,
        fetchOpenAPI2GeneratorClientListFailure,

        generateServerCodeFromOpenAPI3,
        generateServerCodeFromOpenAPI3Started,
        generateServerCodeFromOpenAPI3Success,
        generateServerCodeFromOpenAPI3Failure,

        generateClientCodeFromOpenAPI3,
        generateClientCodeFromOpenAPI3Started,
        generateClientCodeFromOpenAPI3Success,
        generateClientCodeFromOpenAPI3Failure,

        generateServerCodeFromOpenAPI20,
        generateServerCodeFromOpenAPI20Started,
        generateServerCodeFromOpenAPI20Success,
        generateServerCodeFromOpenAPI20Failure,

        generateClientCodeFromOpenAPI20,
        generateClientCodeFromOpenAPI20Started,
        generateClientCodeFromOpenAPI20Success,
        generateClientCodeFromOpenAPI20Failure,
      },
      selectors: {
        selectOpenAPI3GeneratorServerListURL,
        selectOpenAPI3GenerateServerURL,
        selectOpenAPI3GeneratorServerListStatus,
        selectOpenAPI3GeneratorServerList,

        selectOpenAPI3GeneratorClientListURL,
        selectOpenAPI3GenerateClientURL,
        selectOpenAPI3GeneratorClientListStatus,
        selectOpenAPI3GeneratorClientList,

        selectOpenAPI2GeneratorServerListURL,
        selectOpenAPI2GenerateServerURL,
        selectOpenAPI2GeneratorServerListStatus,
        selectOpenAPI2GeneratorServerList,

        selectOpenAPI2GeneratorClientListURL,
        selectOpenAPI2GenerateClientURL,
        selectOpenAPI2GeneratorClientListStatus,
        selectOpenAPI2GeneratorClientList,
      },
      reducers,
    },
  },
});

export default TopBarPlugin;
