import PropTypes from 'prop-types';

const DownloadResolvedJSONMenuItem = ({
  getComponent,
  editorSelectors,
  onClick,
  children = null,
}) => {
  const DropdownMenuItem = getComponent('DropdownMenuItem');
  const isContentTypeOpenAPI = editorSelectors.selectIsContentTypeOpenAPI();
  const isContentTypeAsyncAPI = editorSelectors.selectIsContentTypeAsyncAPI();
  const isContentTypeJSONSchema202012 = editorSelectors.selectIsContentTypeJSONSchema202012();
  const isContentFormatJSON = editorSelectors.selectIsContentFormatJSON();
  const isContentFormatYAML = editorSelectors.selectIsContentFormatYAML();

  return (isContentTypeOpenAPI || isContentTypeAsyncAPI || isContentTypeJSONSchema202012) &&
    (isContentFormatJSON || isContentFormatYAML) ? (
    <DropdownMenuItem onClick={onClick}>{children || 'Download Resolved JSON'}</DropdownMenuItem>
  ) : null;
};

DownloadResolvedJSONMenuItem.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectIsContentTypeOpenAPI: PropTypes.func.isRequired,
    selectIsContentTypeAsyncAPI: PropTypes.func.isRequired,
    selectIsContentTypeJSONSchema202012: PropTypes.func.isRequired,
    selectIsContentFormatJSON: PropTypes.func.isRequired,
    selectIsContentFormatYAML: PropTypes.func.isRequired,
  }).isRequired,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
};

export default DownloadResolvedJSONMenuItem;
