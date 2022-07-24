import PropTypes from 'prop-types';

const DownloadResolvedJSONMenuItem = ({ getComponent, editorSelectors, onClick, children }) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentTypeOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();
  const isContentTypeAsyncAPI = editorSelectors.selectIsContentTypeAsyncAPI();
  const isContentFormatJSON = editorSelectors.selectIsContentFormatJSON();
  const isContentFormatYAML = editorSelectors.selectIsContentFormatYAML();

  return (isContentTypeOpenAPI || isContentTypeAsyncAPI) &&
    (isContentFormatJSON || isContentFormatYAML) ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Download Resolved JSON'}</DropdownMenuItem>
  ) : null;
};

DownloadResolvedJSONMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentTypeOpenAPI: PropTypes.func.isRequired,
    selectIsContentTypeAsyncAPI: PropTypes.func.isRequired,
    selectIsContentFormatJSON: PropTypes.func.isRequired,
    selectIsContentFormatYAML: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

DownloadResolvedJSONMenuItem.defaultProps = {
  children: null,
};

export default DownloadResolvedJSONMenuItem;
