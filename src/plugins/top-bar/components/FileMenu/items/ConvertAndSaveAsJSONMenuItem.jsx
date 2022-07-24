import PropTypes from 'prop-types';

const ConvertAndSaveAsJSONMenuItem = ({ getComponent, editorSelectors, children, onClick }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentFormatYAML = editorSelectors.selectIsContentFormatYAML();

  return isContentFormatYAML ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Convert and Save as JSON'}</DropdownMenuItem>
  ) : null;
};

ConvertAndSaveAsJSONMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentFormatYAML: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ConvertAndSaveAsJSONMenuItem.defaultProps = {
  children: null,
};

export default ConvertAndSaveAsJSONMenuItem;
