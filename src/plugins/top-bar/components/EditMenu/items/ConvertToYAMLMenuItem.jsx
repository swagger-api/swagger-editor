import PropTypes from 'prop-types';

const ConvertToYAMLMenuItem = ({ getComponent, editorSelectors, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const isContentFormatJSON = editorSelectors.selectIsContentFormatJSON();

  return isContentFormatJSON ? (
    <>
      <DropdownMenuItemDivider />
      <DropdownMenuItem onClick={onClick}>{children || 'Convert to YAML'}</DropdownMenuItem>
    </>
  ) : null;
};

ConvertToYAMLMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentFormatJSON: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default ConvertToYAMLMenuItem;
