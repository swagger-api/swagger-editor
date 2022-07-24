import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import GenerateMenu from './GenerateMenu.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const OpenAPI2GenerateClientMenu = (props) => {
  const { getComponent, editorSelectors, editorTopBarSelectors, editorTopBarActions } = props;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const isContentTYpeOpenAPI20 = editorSelectors.selectIsContentTypeOpenAPI20();
  const clientList = editorTopBarSelectors.selectOpenAPI2GeneratorClientList();
  const canShow = isContentTYpeOpenAPI20 && clientList !== null;
  const alertDialogMessage = useRef('');
  const AlertDialog = getComponent('AlertDialog', true);

  const handleAlertDialogClose = useCallback(() => {
    alertDialogMessage.current = '';
    setIsAlertDialogOpen(false);
  }, []);

  const handleMenuItemClick = useCallback(
    async (event, language) => {
      const content = editorSelectors.selectContent();
      const fsa = await editorTopBarActions.generateClientCodeFromOpenAPI20({ content, language });

      if (fsa.error) {
        alertDialogMessage.current = fsa.meta.errorMessage;
        setIsAlertDialogOpen(true);
      }
    },
    [editorSelectors, editorTopBarActions]
  );

  return canShow ? (
    <>
      <AlertDialog
        isOpen={isAlertDialogOpen}
        title="Uh oh, an error has occurred"
        onClose={handleAlertDialogClose}
      >
        {alertDialogMessage.current}
      </AlertDialog>
      <GenerateMenu
        label="Generate Client"
        items={clientList}
        onMenuItemClick={handleMenuItemClick}
        {...props}
      />
    </>
  ) : null;
};

OpenAPI2GenerateClientMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectIsContentTypeOpenAPI20: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarSelectors: PropTypes.shape({
    selectOpenAPI2GeneratorClientList: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarActions: PropTypes.shape({
    generateClientCodeFromOpenAPI20: PropTypes.func.isRequired,
  }).isRequired,
};

export default OpenAPI2GenerateClientMenu;
