import PropTypes from 'prop-types';

const ImportUrlMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'Import URL'}</DropdownMenuItem>;
};

ImportUrlMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ImportUrlMenuItem.defaultProps = {
  children: null,
};

export default ImportUrlMenuItem;
