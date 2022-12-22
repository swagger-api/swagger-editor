import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import EditMenuHandler from './EditMenuHandler.jsx';

const EditMenu = (props) => {
  const { getComponent } = props;
  const DropdownMenu = getComponent('DropdownMenu');
  const ClearMenuItem = getComponent('TopBarEditMenuClearMenuItem', true);
  const ConvertToJSONMenuItem = getComponent('TopBarEditMenuConvertToJSONMenuItem', true);
  const ConvertToYAMLMenuItem = getComponent('TopBarEditMenuConvertToYAMLMenuItem', true);
  const ConvertToOpenAPI30xMenuItem = getComponent(
    'TopBarEditMenuConvertToOpenAPI30xMenuItem',
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

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <EditMenuHandler {...props} ref={editMenuHandler} />
      <DropdownMenu label="Edit">
        <ClearMenuItem onClick={handleClearClick} />
        <ConvertToJSONMenuItem onClick={handleConvertToJSONClick} />
        <ConvertToYAMLMenuItem onClick={handleConvertToYAMLClick} />
        <ConvertToOpenAPI30xMenuItem onClick={handleConvertOpenAPI20ToOpenAPI30xClick} />
      </DropdownMenu>
    </>
  );
};

EditMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default EditMenu;
