import PropTypes from 'prop-types';

const SaveAsMenuItem = ({ getComponent, editorSelectors, onClick, children = null }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const itemName = editorSelectors.selectIsContentFormatJSON()
    ? 'Save (as JSON)'
    : editorSelectors.selectIsContentFormatYAML()
      ? 'Save (as YAML)'
      : 'Save';

  return <DropdownMenuItem onClick={onClick}>{children || itemName}</DropdownMenuItem>;
};

SaveAsMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentFormatJSON: PropTypes.func.isRequired,
    selectIsContentFormatYAML: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default SaveAsMenuItem;
