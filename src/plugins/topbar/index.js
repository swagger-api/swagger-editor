import LinkHome from './components/LinkHome';
import DropdownMenu from './components/DropdownMenu';
import DropdownItem from './components/DropdownItem';
import FileMenuDropdown from './components/FileMenuDropdown';
import EditMenuDropdown from './components/EditMenuDropdown';
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
      FileMenuDropdown,
      EditMenuDropdown,
      ImportFileDropdownItem,
      GeneratorMenuDropdown,
      SaveAsJsonOrYaml,
    },
  };
}
