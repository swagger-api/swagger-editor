import PropTypes from 'prop-types';

const AsyncAPI25StreetlightsMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return (
    <DropdownMenuItem onClick={onClick}>{children || 'AsyncAPI 2.5 Streetlights'}</DropdownMenuItem>
  );
};

AsyncAPI25StreetlightsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

AsyncAPI25StreetlightsMenuItem.defaultProps = {
  children: null,
};

export default AsyncAPI25StreetlightsMenuItem;
