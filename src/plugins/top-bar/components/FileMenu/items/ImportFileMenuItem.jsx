import PropTypes from 'prop-types';

const ImportFileMenuItem = ({ getComponent, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');

  return <DropdownMenuItem onClick={onClick}>{children || 'Import File'}</DropdownMenuItem>;
};

ImportFileMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ImportFileMenuItem.defaultProps = {
  children: null,
};

export default ImportFileMenuItem;
