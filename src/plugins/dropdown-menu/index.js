import DropdownMenu from './components/DropdownMenu/DropdownMenu.jsx';
import DropdownMenuItem from './components/DropdownMenuItem/DropdownMenuItem.jsx';
import DropdownMenuItemDivider from './components/DropdownMenuItemDivider.jsx';

const DropdownMenuPlugin = () => ({
  components: {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuItemDivider,
  },
});

export default DropdownMenuPlugin;
