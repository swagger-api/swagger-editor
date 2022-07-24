import PropTypes from 'prop-types';

const SaveAsMenuItem = ({ getComponent, editorSelectors, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  // eslint-disable-next-line no-nested-ternary
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

SaveAsMenuItem.defaultProps = {
  children: null,
};

export default SaveAsMenuItem;
