import PropTypes from 'prop-types';

const ConvertToOpenAPI30xMenuItem = ({
  getComponent,
  editorSelectors,
  onClick,
  children = null,
}) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentTypeOpenAPI20 = editorSelectors.selectIsContentTypeOpenAPI20();
  const converterURL = editorSelectors.selectOpenAPI20ConverterURL();

  return isContentTypeOpenAPI20 && converterURL ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Convert to OpenAPI 3.0.x'}</DropdownMenuItem>
  ) : null;
};

ConvertToOpenAPI30xMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentTypeOpenAPI20: PropTypes.func.isRequired,
    selectOpenAPI20ConverterURL: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default ConvertToOpenAPI30xMenuItem;
