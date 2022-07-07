import { useImperativeHandle, useRef, forwardRef } from 'react';

import ImportUrlMenuItemHandler from './items/ImportUrlMenuItemHandler.jsx';
import ImportFileMenuItemHandler from './items/ImportFileMenuItemHandler.jsx';
import SaveAsMenuItemHandler from './items/SaveAsMenuItemHandler.jsx';
import ConvertAndSaveAsJSONMenuItemHandler from './items/ConvertAndSaveAsJSONMenuItemHandler.jsx';
import ConvertAndSaveAsYAMLMenuItemHandler from './items/ConvertAndSaveAsYAMLMenuItemHandler.jsx';
import DownloadResolvedJSONMenuItemHandler from './items/DownloadResolvedJSONMenuItemHandler.jsx';
import DownloadResolvedYAMLMenuItemHandler from './items/DownloadResolvedYAMLMenuItemHandler.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const FileMenuHandler = (props, ref) => {
  const importUrlMenuItemHandler = useRef(null);
  const importFileMenuItemHandler = useRef(null);
  const saveAsMenuItemHandler = useRef(null);
  const convertAndSaveAsJSONMenuItemHandler = useRef(null);
  const convertAndSaveAsYAMLMenuItemHandler = useRef(null);
  const downloadResolvedJSONMenuItemHandler = useRef(null);
  const downloadResolvedYAMLMenuItemHandler = useRef(null);

  useImperativeHandle(ref, () => ({
    importURL(event) {
      importUrlMenuItemHandler.current.openModal(event);
    },
    async importFile(event) {
      await importFileMenuItemHandler.current.openFileDialog(event);
    },
    async saveAs(event) {
      await saveAsMenuItemHandler.current.downloadContent(event);
    },
    async convertAndSaveAsJSON(event) {
      await convertAndSaveAsJSONMenuItemHandler.current.convertAndSaveAsJSON(event);
    },
    async convertAndSaveAsYAML(event) {
      await convertAndSaveAsYAMLMenuItemHandler.current.convertAndSaveAsYAML(event);
    },
    async downloadResolvedJSON(event) {
      await downloadResolvedJSONMenuItemHandler.current.downloadResolvedJSON(event);
    },
    async downloadResolvedYAML(event) {
      await downloadResolvedYAMLMenuItemHandler.current.downloadResolvedYAML(event);
    },
  }));

  return (
    <>
      <ImportUrlMenuItemHandler ref={importUrlMenuItemHandler} {...props} />
      <ImportFileMenuItemHandler ref={importFileMenuItemHandler} {...props} />
      <SaveAsMenuItemHandler ref={saveAsMenuItemHandler} {...props} />
      <ConvertAndSaveAsJSONMenuItemHandler ref={convertAndSaveAsJSONMenuItemHandler} {...props} />
      <ConvertAndSaveAsYAMLMenuItemHandler ref={convertAndSaveAsYAMLMenuItemHandler} {...props} />
      <DownloadResolvedJSONMenuItemHandler ref={downloadResolvedJSONMenuItemHandler} {...props} />
      <DownloadResolvedYAMLMenuItemHandler ref={downloadResolvedYAMLMenuItemHandler} {...props} />
    </>
  );
};

export default forwardRef(FileMenuHandler);
