import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import EditMenuHandler from './EditMenuHandler.jsx';

const EditMenu = (props) => {
  const { getComponent } = props;
  const DropdownMenu = getComponent('DropdownMenu');
  const DropdownMenuItemDivider = getComponent('DropdownMenuItemDivider');
  const ClearMenuItem = getComponent('TopBarEditMenuClearMenuItem', true);
  const ConvertToJSONMenuItem = getComponent('TopBarEditMenuConvertToJSONMenuItem', true);
  const ConvertToYAMLMenuItem = getComponent('TopBarEditMenuConvertToYAMLMenuItem', true);
  const ConvertToOpenAPI30xMenuItem = getComponent(
    'TopBarEditMenuConvertToOpenAPI30xMenuItem',
    true
  );
  const LoadAsyncAPI24FixtureMenuItem = getComponent(
    'TopBarEditMenuLoadAsyncAPI24FixtureMenuItem',
    true
  );
  const LoadAsyncAPI24PetstoreFixtureMenuItem = getComponent(
    'TopBarEditMenuLoadAsyncAPI24PetstoreFixtureMenuItem',
    true
  );
  const LoadOpenAPI20FixtureMenuItem = getComponent(
    'TopBarEditMenuLoadOpenAPI20FixtureMenuItem',
    true
  );
  const LoadOpenAPI30FixtureMenuItem = getComponent(
    'TopBarEditMenuLoadOpenAPI30FixtureMenuItem',
    true
  );
  const LoadOpenAPI20PetstoreFixtureMenuItem = getComponent(
    'TopBarEditMenuLoadOpenAPI20PetstoreFixtureMenuItem',
    true
  );
  const LoadOpenAPI30PetstoreFixtureMenuItem = getComponent(
    'TopBarEditMenuLoadOpenAPI30PetstoreFixtureMenuItem',
    true
  );
  const LoadOpenAPI31FixtureMenuItem = getComponent(
    'TopBarEditMenuLoadOpenAPI31FixtureMenuItem',
    true
  );
  const LoadAPIDesignSystemsFixtureMenuItem = getComponent(
    'TopBarEditMenuLoadAPIDesignSystemsFixtureMenuItem',
    true
  );
  const editMenuHandler = useRef(null);

  const handleClearClick = useCallback(() => {
    editMenuHandler.current.clear();
  }, []);
  const handleConvertToJSONClick = useCallback(async () => {
    await editMenuHandler.current.convertToJSON();
  }, []);
  const handleConvertToYAMLClick = useCallback(async () => {
    await editMenuHandler.current.convertToYAML();
  }, []);
  const handleConvertOpenAPI20ToOpenAPI30xClick = useCallback(async () => {
    await editMenuHandler.current.convertOpenAPI20ToOpenAPI30xClick();
  }, []);
  const handleLoadOpenAPI20PetstoreFixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadOpenAPI20PetstoreFixture();
  }, []);
  const handleLoadOpenAPI30PetstoreFixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadOpenAPI30PetstoreFixture();
  }, []);
  const handleLoadOpenAPI20FixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadOpenAPI20Fixture();
  }, []);
  const handleLoadOpenAPI30FixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadOpenAPI30Fixture();
  }, []);
  const handleLoadOpenAPI31FixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadOpenAPI31Fixture();
  }, []);
  const handleLoadAsyncAPI24FixtureClick = useCallback(async () => {
    await editMenuHandler.current.loadAsyncAPI24Fixture();
  }, []);
  const handleLoadAsyncAPI24PetstoreFixtureClick = useCallback(() => {
    editMenuHandler.current.loadAsyncAPI24PetstoreFixture();
  }, []);
  const loadAPIDesignSystemsFixtureClick = useCallback(() => {
    editMenuHandler.current.loadAPIDesignSystemsFixture();
  }, []);

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <EditMenuHandler {...props} ref={editMenuHandler} />
      <DropdownMenu label="Edit">
        <ClearMenuItem onClick={handleClearClick} />
        <ConvertToJSONMenuItem onClick={handleConvertToJSONClick} />
        <ConvertToYAMLMenuItem onClick={handleConvertToYAMLClick} />
        <ConvertToOpenAPI30xMenuItem onClick={handleConvertOpenAPI20ToOpenAPI30xClick} />
        <DropdownMenuItemDivider />
        <LoadOpenAPI20PetstoreFixtureMenuItem onClick={handleLoadOpenAPI20PetstoreFixtureClick} />
        <LoadOpenAPI30PetstoreFixtureMenuItem onClick={handleLoadOpenAPI30PetstoreFixtureClick} />
        <LoadAsyncAPI24FixtureMenuItem onClick={handleLoadAsyncAPI24FixtureClick} />
        <LoadOpenAPI20FixtureMenuItem onClick={handleLoadOpenAPI20FixtureClick} />
        <LoadOpenAPI30FixtureMenuItem onClick={handleLoadOpenAPI30FixtureClick} />
        <LoadOpenAPI31FixtureMenuItem onClick={handleLoadOpenAPI31FixtureClick} />
        <LoadAsyncAPI24PetstoreFixtureMenuItem onClick={handleLoadAsyncAPI24PetstoreFixtureClick} />
        <LoadAPIDesignSystemsFixtureMenuItem onClick={loadAPIDesignSystemsFixtureClick} />
      </DropdownMenu>
    </>
  );
};

EditMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditMenu;
