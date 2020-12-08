// This is where we import the topbar component
// and wrap state plugins, component

import TopbarPlugin from '../topbar';
// import TopbarInsertPlugin from './topbar-insert';
// import TopbarMenuFileImportFile from './topbar-menu-file-import_file';
// import TopbarMenuEditConvert from './topbar-menu-edit-convert';
import DropdownMenu from '../topbar/components/DropdownMenu';
import DropdownItem from '../topbar/components/DropdownItem';
import FileMenuDropdown from '../topbar/components/FileMenuDropdown';
import EditMenuDropdown from '../topbar/components/EditMenuDropdown';
import ImportFileDropdownItem from '../topbar/components/ImportFileDropdownItem';
import StandaloneLayout from './standalone-layout';

const StandalonePlugin = () => {
  return {
    components: {
      StandaloneLayout,
      DropdownMenu,
      DropdownItem,
      FileMenuDropdown,
      EditMenuDropdown,
      ImportFileDropdownItem,
    },
  };
};

export default function standalonePlugin() {
  return [
    TopbarPlugin,
    // TopbarInsertPlugin,
    // TopbarMenuFileImportFile,
    // TopbarMenuEditConvert,
    StandalonePlugin,
  ];
}
