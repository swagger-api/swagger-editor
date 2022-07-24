import PropTypes from 'prop-types';

const GenerateMenu = ({ getComponent, items, label, onMenuItemClick }) => {
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  const handleMenuClick = (item) => (event) => {
    onMenuItemClick(event, item);
  };

  return (
    <DropdownMenu label={label} isLong>
      {items.map((item) => (
        <DropdownMenuItem key={item} onClick={handleMenuClick(item)}>
          {item}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
};

GenerateMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};
export default GenerateMenu;
