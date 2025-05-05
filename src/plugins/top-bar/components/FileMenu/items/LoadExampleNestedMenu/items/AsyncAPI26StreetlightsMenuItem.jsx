import PropTypes from 'prop-types';

const AsyncAPI26StreetlightsMenuItem = ({ getComponent, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 2.6 Streetlights'}</DropdownMenuItem>
  );
};

AsyncAPI26StreetlightsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default AsyncAPI26StreetlightsMenuItem;
