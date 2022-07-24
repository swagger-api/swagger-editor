import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import GenerateMenu from './GenerateMenu.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const OpenAPI2GenerateServerMenu = (props) => {
  const { editorTopBarActions, editorSelectors, editorTopBarSelectors, getComponent } = props;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const isContentTYpeOpenAPI20 = editorSelectors.selectIsContentTypeOpenAPI20();
  const serverList = editorTopBarSelectors.selectOpenAPI2GeneratorServerList();
  const canShow = isContentTYpeOpenAPI20 && serverList !== null;
  const alertDialogMessage = useRef('');
  const AlertDialog = getComponent('AlertDialog', true);

  const handleAlertDialogClose = useCallback(() => {
    alertDialogMessage.current = '';
    setIsAlertDialogOpen(false);
  }, []);

  const handleMenuItemClick = useCallback(
    async (event, framework) => {
      const content = editorSelectors.selectContent();
      const fsa = await editorTopBarActions.generateServerCodeFromOpenAPI20({ content, framework });

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
        label="Generate Server"
        items={serverList}
        onMenuItemClick={handleMenuItemClick}
        {...props}
      />
    </>
  ) : null;
};

OpenAPI2GenerateServerMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectIsContentTypeOpenAPI20: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarSelectors: PropTypes.shape({
    selectOpenAPI2GeneratorServerList: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarActions: PropTypes.shape({
    generateServerCodeFromOpenAPI20: PropTypes.func.isRequired,
  }).isRequired,
};

export default OpenAPI2GenerateServerMenu;
