import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import GenerateMenu from './GenerateMenu.jsx';

/* eslint-disable react/jsx-props-no-spreading */

const OpenAPI3GenerateServerMenu = (props) => {
  const { getComponent, editorSelectors, editorTopBarSelectors, editorTopBarActions } = props;
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const isContentTypeOpenAPI30x = editorSelectors.selectIsContentTypeOpenAPI30x();
  const isContentTYpeOpenAPI31x = editorSelectors.selectIsContentTypeOpenAPI31x();
  const serverList = editorTopBarSelectors.selectOpenAPI3GeneratorServerList();
  const canShow = (isContentTypeOpenAPI30x || isContentTYpeOpenAPI31x) && serverList !== null;
  const alertDialogMessage = useRef('');
  const AlertDialog = getComponent('AlertDialog', true);

  const handleAlertDialogClose = useCallback(() => {
    alertDialogMessage.current = '';
    setIsAlertDialogOpen(false);
  }, []);

  const handleMenuItemClick = useCallback(
    async (event, framework) => {
      const content = editorSelectors.selectContent();
      const fsa = await editorTopBarActions.generateServerCodeFromOpenAPI3({ content, framework });

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
      </AlertDialog>{' '}
      <GenerateMenu
        label="Generate Server"
        items={serverList}
        onMenuItemClick={handleMenuItemClick}
        {...props}
      />
    </>
  ) : null;
};

OpenAPI3GenerateServerMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
  editorSelectors: PropTypes.shape({
    selectContent: PropTypes.func.isRequired,
    selectIsContentTypeOpenAPI30x: PropTypes.func.isRequired,
    selectIsContentTypeOpenAPI31x: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarSelectors: PropTypes.shape({
    selectOpenAPI3GeneratorServerList: PropTypes.func.isRequired,
  }).isRequired,
  editorTopBarActions: PropTypes.shape({
    generateServerCodeFromOpenAPI3: PropTypes.func.isRequired,
  }).isRequired,
};

export default OpenAPI3GenerateServerMenu;
