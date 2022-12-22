import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import FileMenuHandler from './FileMenuHandler.jsx';

const FileMenu = (props) => {
  const { getComponent } = props;
  const fileMenuHandler = useRef(null);
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const ImportUrlMenuItem = getComponent('TopBarFileMenuImportUrlMenuItem', true);
  const ImportFileMenuItem = getComponent('TopBarFileMenuImportFileMenuItem', true);
  const LoadExampleNestedMenu = getComponent('TopBarFileMenuLoadExampleNestedMenu', true);
  const SaveAsMenuItem = getComponent('TopBarFileMenuSaveAsMenuItem', true);
  const ConvertAndSaveAsJSONMenuItem = getComponent(
    'TopBarFileMenuConvertAndSaveAsJSONMenuItem',
    true
  );
  const ConvertAndSaveAsYAMLMenuItem = getComponent(
    'TopBarFileMenuConvertAndSaveAsYAMLMenuItem',
    true
  );
  const DownloadResolvedJSONMenuItem = getComponent(
    'TopBarFileMenuDownloadResolvedJSONMenuItem',
    true
  );
  const DownloadResolvedYAMLMenuItem = getComponent(
    'TopBarFileMenuDownloadResolvedYAMLMenuItem',
    true
  );

  const handleUrlImportClick = useCallback((event) => {
    fileMenuHandler.current.importURL(event);
  }, []);
  const handleFileImportClick = useCallback(async (event) => {
    await fileMenuHandler.current.importFile(event);
  }, []);
  const handleSaveAsClick = useCallback(async (event) => {
    await fileMenuHandler.current.saveAs(event);
  }, []);
  const handleConvertAndSaveAsJSONClick = useCallback(async (event) => {
    await fileMenuHandler.current.convertAndSaveAsJSON(event);
  }, []);
  const handleConvertAndSaveAsYAMLClick = useCallback(async (event) => {
    await fileMenuHandler.current.convertAndSaveAsYAML(event);
  }, []);
  const handleDownloadResolvedJSONClick = useCallback(async (event) => {
    await fileMenuHandler.current.downloadResolvedJSON(event);
  }, []);
  const handleDownloadResolvedYAMLClick = useCallback(async (event) => {
    await fileMenuHandler.current.downloadResolvedYAML(event);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FileMenuHandler {...props} ref={fileMenuHandler} />
      <DropdownMenu label="File">
        <ImportUrlMenuItem onClick={handleUrlImportClick} />
        <ImportFileMenuItem onClick={handleFileImportClick} />
        <LoadExampleNestedMenu />
        <DropdownMenuItemDivider />
        <SaveAsMenuItem onClick={handleSaveAsClick} />
        <ConvertAndSaveAsJSONMenuItem onClick={handleConvertAndSaveAsJSONClick} />
        <ConvertAndSaveAsYAMLMenuItem onClick={handleConvertAndSaveAsYAMLClick} />
        <DropdownMenuItemDivider />
        <DownloadResolvedJSONMenuItem onClick={handleDownloadResolvedJSONClick} />
        <DownloadResolvedYAMLMenuItem onClick={handleDownloadResolvedYAMLClick} />
      </DropdownMenu>
    </>
  );
};

FileMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default FileMenu;
