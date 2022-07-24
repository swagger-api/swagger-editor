import PropTypes from 'prop-types';

/* eslint-disable */

const TopBar = ({ getComponent }) => {
  const Logo = getComponent('TopBarLogo');
  const FileMenu = getComponent('TopBarFileMenu', true);
  const EditMenu = getComponent('TopBarEditMenu', true);
  const OpenAPI3GenerateServerMenu = getComponent('TopBarOpenAPI3GenerateServerMenu', true);
  const OpenAPI3GenerateClientMenu = getComponent('TopBarOpenAPI3GenerateClientMenu', true);
  const OpenAPI2GenerateServerMenu = getComponent('TopBarOpenAPI2GenerateServerMenu', true);
  const OpenAPI2GenerateClientMenu = getComponent('TopBarOpenAPI2GenerateClientMenu', true);

  return (
    <div className="swagger-editor__top-bar">
      <div className="swagger-editor__top-bar-wrapper">
        <Logo />
        <FileMenu />
        <EditMenu />
        <OpenAPI3GenerateServerMenu />
        <OpenAPI3GenerateClientMenu />
        <OpenAPI2GenerateServerMenu />
        <OpenAPI2GenerateClientMenu />
      </div>
    </div>
  );
};

TopBar.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default TopBar;
