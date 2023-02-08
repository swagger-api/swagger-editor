import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import LoadExampleNestedMenuHandler from './LoadExampleNestedMenuHandler.jsx';

const LoadExampleNestedMenu = (props) => {
  const { getComponent } = props;
  const loadExampleNestedMenuHandler = useRef(null);
  const DropDownMenuNested = getComponent('DropdownMenuNested');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const OpenAPI31PetstoreMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuOpenAPI31PetstoreMenuItem',
    true
  );
  const OpenAPI30PetstoreMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuOpenAPI30PetstoreMenuItem',
    true
  );
  const OpenAPI20PetstoreMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuOpenAPI20PetstoreMenuItem',
    true
  );
  const AsyncAPI26PetstoreMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuAsyncAPI26PetstoreMenuItem',
    true
  );
  const AsyncAPI26StreetlightsMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuAsyncAPI26StreetlightsMenuItem',
    true
  );
  const APIDesignSystemsMenuItem = getComponent(
    'TopBarFileMenuLoadExampleNestedMenuAPIDesignSystemsMenuItem',
    true
  );

  const handleOpenAPI31PetstoreClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadOpenAP31PetstoreFixture(event);
  }, []);
  const handleOpenAPI30PetstoreClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadOpenAP30PetstoreFixture(event);
  }, []);
  const handleOpenAPI20PetstoreClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadOpenAP20PetstoreFixture(event);
  }, []);
  const handleAsyncAPI26PetstoreClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadAsyncAPI26PetstoreFixture(event);
  }, []);
  const handleAsyncAPI26StreetlightsClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadAsyncAPI26StreetlightsFixture(event);
  }, []);
  const handleAPIDesignSystemsClick = useCallback(async (event) => {
    await loadExampleNestedMenuHandler.current.loadAPIDesignSystemsFixture(event);
  }, []);

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <LoadExampleNestedMenuHandler {...props} ref={loadExampleNestedMenuHandler} />
      <DropDownMenuNested label="Load Example">
        <OpenAPI31PetstoreMenuItem onClick={handleOpenAPI31PetstoreClick} />
        <OpenAPI30PetstoreMenuItem onClick={handleOpenAPI30PetstoreClick} />
        <OpenAPI20PetstoreMenuItem onClick={handleOpenAPI20PetstoreClick} />
        <DropdownMenuItemDivider />
        <AsyncAPI26PetstoreMenuItem onClick={handleAsyncAPI26PetstoreClick} />
        <AsyncAPI26StreetlightsMenuItem onClick={handleAsyncAPI26StreetlightsClick} />
        <DropdownMenuItemDivider />
        <APIDesignSystemsMenuItem onClick={handleAPIDesignSystemsClick} />
      </DropDownMenuNested>
    </>
  );
};

LoadExampleNestedMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default LoadExampleNestedMenu;
