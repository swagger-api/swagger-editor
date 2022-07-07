import PropTypes from 'prop-types';

const ConvertAndSaveAsJSONMenuItem = ({ getComponent, editorSelectors, children, onClick }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentFormatJSON = editorSelectors.selectIsContentFormatJSON();

  return isContentFormatJSON ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Convert and Save as YAML'}</DropdownMenuItem>
  ) : null;
};

ConvertAndSaveAsJSONMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentFormatJSON: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

ConvertAndSaveAsJSONMenuItem.defaultProps = {
  children: null,
};

export default ConvertAndSaveAsJSONMenuItem;
