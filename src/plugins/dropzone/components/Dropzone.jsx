/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

const Dropzone = ({ getComponent, useDropzone, children }) => {
  const AlertDialog = getComponent('AlertDialog', true);
  const [
    isDragActive,
    isAlertDialogOpen,
    setIsAlertDialogOpen,
    errorMessage,
    getRootProps,
    getInputProps,
  ] = useDropzone();

  const handleAlertDialogClose = () => {
    setIsAlertDialogOpen(false);
  };

  return (
    <div className="dropzone" {...getRootProps()}>
      <AlertDialog
        isOpen={isAlertDialogOpen}
        title="Uh oh, an error has occurred"
        onClose={handleAlertDialogClose}
      >
        {errorMessage}
      </AlertDialog>
      <input data-cy="dropzone" {...getInputProps()} />
      {isDragActive && (
        <div className="dropzone__overlay">
          Please drop an OpenAPI 2.0/3.0/3.1 or AsyncApi 2.x definition in .yaml or .json format.
        </div>
      )}
      {children}
    </div>
  );
};

Dropzone.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useDropzone: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dropzone;
