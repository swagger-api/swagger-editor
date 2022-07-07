import PropTypes from 'prop-types';

const ConvertToJSONMenuItem = ({ getComponent, editorSelectors, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const isContentFormatYAML = editorSelectors.selectIsContentFormatYAML();

  return isContentFormatYAML ? (
    <>
      <DropdownMenuItemDivider />
      <DropdownMenuItem onClick={onClick}>{children || 'Convert to JSON'}</DropdownMenuItem>
    </>
  ) : null;
};

ConvertToJSONMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentFormatYAML: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ConvertToJSONMenuItem.defaultProps = {
  children: null,
};

export default ConvertToJSONMenuItem;
