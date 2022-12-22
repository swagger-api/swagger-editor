import DropdownMenu from './components/DropdownMenu/DropdownMenu.jsx';
import DropdownMenuNested from './components/DropdownMenuNested/DropdownMenuNested.jsx';
import DropdownMenuItem from './components/DropdownMenuItem/DropdownMenuItem.jsx';
import DropdownMenuItemDivider from './components/DropdownMenuItemDivider.jsx';

const DropdownMenuPlugin = () => ({
  components: {
    DropdownMenu,
    DropdownMenuNested,
    DropdownMenuItem,
    DropdownMenuItemDivider,
  },
});

export default DropdownMenuPlugin;
