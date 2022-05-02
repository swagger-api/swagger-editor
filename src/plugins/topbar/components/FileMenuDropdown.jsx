import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useLanguageFormat } from './shared-hooks.jsx';
import ImportUrl from './ImportUrl.jsx';

const FileMenuDropdown = ({ getComponent, topbarActions, topbarSelectors }) => {
  const languageFormat = useLanguageFormat(topbarActions, topbarSelectors);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [isImportUrlDialogOpen, setIsImportUrlDialogOpen] = useState(false);
  const [importUrlString, setImportUrlString] = useState('');

  const handleSaveAsJsonClick = () => {
    async function saveAsJson() {
      const saveResult = await topbarActions.saveAsJson();
      if (saveResult && saveResult.error) {
        // set & display the error message
        setErrorMessage(saveResult.error); // original non-resolved
        setIsAlertDialogOpen(true);
      }
    }
    // call the async/await function
    saveAsJson();
  };

  const handleSaveAsYamlClick = () => {
    async function saveAsYaml() {
      const saveResult = await topbarActions.saveAsYaml({ overrideWarning: false });
      if (saveResult && saveResult.warning) {
        setIsConfirmDialogOpen(true);
        setConfirmMessage(saveResult.warning);
      }
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setIsAlertDialogOpen(true);
      }
    }
    // call the async/await function
    saveAsYaml();
  };

  const handleSaveAsYamlWithOverride = () => {
    async function saveAsYaml() {
      const saveResult = await topbarActions.saveAsYaml({ overrideWarning: true });
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setIsAlertDialogOpen(true);
      }
      setIsConfirmDialogOpen(false);
      setConfirmMessage('');
    }
    // call the async/await function
    saveAsYaml();
  };

  const handleSaveAsJsonResolvedClick = () => {
    async function saveAsJson() {
      const saveResult = await topbarActions.saveAsJsonResolved();
      if (saveResult && saveResult.error) {
        // set & display the error message
        setErrorMessage(saveResult.error); // original non-resolved
        setIsAlertDialogOpen(true);
      }
    }
    // call the async/await function
    saveAsJson();
  };

  const handleSaveAsYamlResolvedClick = () => {
    async function saveAsYaml() {
      const saveResult = await topbarActions.saveAsYamlResolved({ overrideWarning: false });
      if (saveResult && saveResult.warning) {
        setIsConfirmDialogOpen(true);
        setConfirmMessage(saveResult.warning);
      }
      if (saveResult && saveResult.error) {
        // set & display the error message
        if (saveResult.payload.message) {
          // we can get this error message if we forgot the 'overrideWarning" option above
          setErrorMessage(saveResult.payload.message);
        } else if (saveResult.error) {
          setErrorMessage(saveResult.error);
        }
        setIsAlertDialogOpen(true);
      }
    }
    // call the async/await function
    saveAsYaml();
  };

  const handleImportUrlClick = () => {
    setImportUrlString('');
    setIsImportUrlDialogOpen(true);
  };

  const handleImportUrlChange = (e) => {
    setImportUrlString(e.target.value);
  };

  const handleImportFromURL = () => {
    // dev note for copy/paste testing https://petstore.swagger.io/v2/swagger.json
    // another url: https://petstore3.swagger.io/api/v3/openapi.json
    async function importFromURL({ url }) {
      const importedData = await topbarActions.importFromURL({ url });
      if (importedData && importedData.error) {
        // set & display error message
        setErrorMessage(importedData.error);
        setIsAlertDialogOpen(true);
      }
    }
    // call the async/await function
    importFromURL({ url: importUrlString });
  };

  const handleSubmitImportUrl = () => {
    // todo refactor: we should send importUrlString through a safety check
    if (importUrlString) {
      handleImportFromURL(importUrlString);
    }
    setIsImportUrlDialogOpen(false);
  };

  const handleConfirmDialogClose = (result) => {
    if (result) {
      handleSaveAsYamlWithOverride();
    } else {
      setIsConfirmDialogOpen(false);
    }
  };

  const handleAlertDialogClose = () => {
    setIsAlertDialogOpen(false);
  };

  const handleImportUrlDialogClose = (result) => {
    if (result) {
      handleSubmitImportUrl();
    } else {
      setIsImportUrlDialogOpen(false);
    }
  };

  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownItem = getComponent('DropdownItem');
  const ImportFileDropdownItem = getComponent('ImportFileDropdownItem');
  const SaveAsJsonOrYaml = getComponent('SaveAsJsonOrYaml');
  const AlertDialog = getComponent('AlertDialog', true);
  const ConfirmDialog = getComponent('ConfirmDialog', true);

  return (
    <div>
      <AlertDialog
        isOpen={isAlertDialogOpen}
        title="Uh oh, an error has occurred"
        onClose={handleAlertDialogClose}
      >
        {errorMessage}
      </AlertDialog>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Please confirm"
        onClose={handleConfirmDialogClose}
      >
        <>
          Warning: {confirmMessage}
          <br />
          <div>Are you sure you want to continue?</div>
        </>
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={isImportUrlDialogOpen}
        title="Import URL"
        onClose={handleImportUrlDialogClose}
      >
        <ImportUrl onImportUrlChange={handleImportUrlChange} />
      </ConfirmDialog>
      <DropdownMenu displayName="File">
        <DropdownItem onClick={() => handleImportUrlClick()} name="Import URL" />
        <ImportFileDropdownItem getComponent={getComponent} topbarActions={topbarActions} />
        <li role="separator" />
        <SaveAsJsonOrYaml
          getComponent={getComponent}
          languageFormat={languageFormat}
          onSaveAsJsonClick={handleSaveAsJsonClick}
          onSaveAsYamlClick={handleSaveAsYamlClick}
        />
        <li role="separator" />
        <DropdownItem
          onClick={() => handleSaveAsJsonResolvedClick()}
          name="Download Resolved JSON"
        />
        <DropdownItem
          onClick={() => handleSaveAsYamlResolvedClick()}
          name="Download Resolved YAML"
        />
      </DropdownMenu>
    </div>
  );
};

FileMenuDropdown.propTypes = {
  getComponent: PropTypes.func.isRequired,
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  topbarSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default FileMenuDropdown;
