// This is where we import the topbar component
// and wrap state plugins, component

import TopbarPlugin from '../topbar';
// import TopbarInsertPlugin from './topbar-insert';
import LinkHome from '../topbar/components/LinkHome';
import DropdownMenu from '../topbar/components/DropdownMenu';
import DropdownItem from '../topbar/components/DropdownItem';
import FileMenuDropdown from '../topbar/components/FileMenuDropdown';
import EditMenuDropdown from '../topbar/components/EditMenuDropdown';
import ImportFileDropdownItem from '../topbar/components/ImportFileDropdownItem';
import GeneratorMenuDropdown from '../topbar/components/GeneratorMenuDropdown';
import StandaloneLayout from './StandaloneLayout';

const StandalonePlugin = () => {
  return {
    components: {
      StandaloneLayout,
      LinkHome,
      DropdownMenu,
      DropdownItem,
      FileMenuDropdown,
      EditMenuDropdown,
      ImportFileDropdownItem,
      GeneratorMenuDropdown,
    },
  };
};

// should load into swagger-ui as a 'preset'
export default function standalonePreset() {
  return [
    TopbarPlugin,
    // TopbarInsertPlugin,
    StandalonePlugin,
  ];
}
