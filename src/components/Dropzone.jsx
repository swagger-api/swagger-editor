/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import ModalErrorWrapper from './ModalErrorWrapper.jsx';
import { importSingleFile } from '../utils/common-file-import-single.js';
import noop from '../utils/common-noop.js';

const Dropzone = ({ children, onDrop }) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      const someFilesWereRejected = rejectedFiles && rejectedFiles.length > 0;
      const thereIsExactlyOneAcceptedFile = acceptedFiles && acceptedFiles.length === 1;

      if (someFilesWereRejected || !thereIsExactlyOneAcceptedFile) {
        const dropFileErrMessage = `Sorry, there was an error processing your file.\nPlease drag and drop exactly one OpenAPI/AsyncAPI definition in .yaml or .json format`;
        setErrorMessage(dropFileErrMessage);
        setShowErrorModal(true);
      } else {
        const file = acceptedFiles[0];
        const importedFile = await importSingleFile(file);
        if (importedFile.data && importedFile.message === 'success') {
          onDrop(importedFile.data, 'fileDrop');
        } else {
          const importedFileErrMessage = `Sorry, there was an error processing your file. Unable to process as valid YAML or JSON `;
          setErrorMessage(importedFileErrMessage);
          setShowErrorModal(true);
        }
      }
    },
    [onDrop]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: '.yaml,application/json',
    multiple: false,
    noClick: true,
  });

  const handleCloseModalClick = (showModalProperty) => () => {
    if (showModalProperty === 'showErrorModal') {
      setShowErrorModal(false);
    }
  };

  return (
    <div className="dropzone" {...getRootProps()}>
      <ModalErrorWrapper
        isOpen={showErrorModal}
        contentLabel="Error Message"
        modalTitle="Uh oh, an error has occured"
        onCloseModalClick={handleCloseModalClick('showErrorModal')}
        onCancelModalClick={handleCloseModalClick('showErrorModal')}
        onSubmitModalClick={() => noop}
        modalBodyContent={errorMessage}
      />
      <input data-cy="dropzone" {...getInputProps()} />
      {isDragActive ? (
        <div className="dropzone__overlay">
          Please drop an OpenAPI 2.0/3.0/3.1 or AsyncApi 2.x defintion in .yaml or .json format.
        </div>
      ) : (
        children
      )}
    </div>
  );
};

Dropzone.propTypes = {
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default Dropzone;
