import LinkHome from './components/LinkHome';
import DropdownMenu from './components/DropdownMenu';
import DropdownItem from './components/DropdownItem';
import ImportFileDropdownItem from './components/ImportFileDropdownItem';
import GeneratorMenuDropdown from './components/GeneratorMenuDropdown';
import SaveAsJsonOrYaml from './components/SaveAsJsonOrYaml';
import Topbar from './components/Topbar';
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
} from './actions';
import {
  selectShouldReInstantiateGeneratorClient,
  selectShouldUpdateDefinitionLanguageFormat,
} from './selectors';

export default function topbarPlugin() {
  return {
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
    components: {
      Topbar,
      LinkHome,
      DropdownMenu,
      DropdownItem,
      ImportFileDropdownItem,
      GeneratorMenuDropdown,
      SaveAsJsonOrYaml,
    },
    wrapComponents: {
      Topbar,
    },
  };
}
