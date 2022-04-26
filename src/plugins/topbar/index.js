import LinkHome from './components/LinkHome.jsx';
import DropdownMenu from './components/DropdownMenu.jsx';
import DropdownItem from './components/DropdownItem.jsx';
import ImportFileDropdownItem from './components/ImportFileDropdownItem.jsx';
import FileMenuDropdownHooks from './components/FileMenuDropdownHooks.jsx';
import EditMenuDropdownHooks from './components/EditMenuDropdownHooks.jsx';
import GeneratorMenuDropdownHooks from './components/GeneratorMenuDropdownHooks.jsx';
import SaveAsJsonOrYaml from './components/SaveAsJsonOrYaml.jsx';
import Topbar from './components/Topbar.jsx';
import {
  instantiateGeneratorClient,
  downloadGeneratedFile,
  importFromURL,
  clearEditor,
  resetEditor,
  convertToYaml,
  saveAsJson,
  saveAsYaml,
  saveAsJsonResolved,
  saveAsYamlResolved,
  convertDefinitionToOas3,
  allowConvertDefinitionToOas3,
  getDefinitionLanguageFormat,
  loadDefaultDefinition,
  importFile,
} from './actions/index.js';
import {
  selectShouldReInstantiateGeneratorClient,
  selectShouldUpdateDefinitionLanguageFormat,
} from './selectors.js';

const TopbarPlugin = () => ({
  components: {
    Topbar,
    LinkHome,
    DropdownMenu,
    DropdownItem,
    ImportFileDropdownItem,
    FileMenuDropdownHooks,
    EditMenuDropdownHooks,
    GeneratorMenuDropdownHooks,
    SaveAsJsonOrYaml,
  },
  statePlugins: {
    topbar: {
      actions: {
        instantiateGeneratorClient,
        downloadGeneratedFile,
        importFromURL,
        clearEditor,
        resetEditor,
        convertToYaml,
        saveAsJson,
        saveAsYaml,
        saveAsJsonResolved,
        saveAsYamlResolved,
        convertDefinitionToOas3,
        allowConvertDefinitionToOas3,
        getDefinitionLanguageFormat,
        loadDefaultDefinition,
        importFile,
      },
      selectors: {
        selectShouldReInstantiateGeneratorClient,
        selectShouldUpdateDefinitionLanguageFormat,
      },
    },
  },
});

export default TopbarPlugin;
