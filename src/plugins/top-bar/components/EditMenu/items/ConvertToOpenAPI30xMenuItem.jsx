import PropTypes from 'prop-types';

const ConvertToOpenAPI30xMenuItem = ({ getComponent, editorSelectors, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentTypeOpenAPI20 = editorSelectors.selectIsContentTypeOpenAPI20();

  return isContentTypeOpenAPI20 ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Convert to OpenAPI 3.0.x'}</DropdownMenuItem>
  ) : null;
};

ConvertToOpenAPI30xMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentTypeOpenAPI20: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ConvertToOpenAPI30xMenuItem.defaultProps = {
  children: null,
};

export default ConvertToOpenAPI30xMenuItem;
