import LinkHome from './components/LinkHome';
import DropdownMenu from './components/DropdownMenu';
import DropdownItem from './components/DropdownItem';
import ImportFileDropdownItem from './components/ImportFileDropdownItem';
import GeneratorMenuDropdown from './components/GeneratorMenuDropdown';
import SaveAsJsonOrYaml from './components/SaveAsJsonOrYaml';
import Topbar from './components/Topbar';
import {
  instantiateGeneratorClient,
  shouldReInstantiateGeneratorClient,
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
  shouldUpdateDefinitionLanguageFormat,
  loadDefaultDefinition,
  importFile,
} from './actions';

export default function topbarPlugin() {
  return {
    statePlugins: {
      topbar: {
        actions: {
          instantiateGeneratorClient,
          shouldReInstantiateGeneratorClient,
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
          shouldUpdateDefinitionLanguageFormat,
          loadDefaultDefinition,
          importFile,
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
  };
}
