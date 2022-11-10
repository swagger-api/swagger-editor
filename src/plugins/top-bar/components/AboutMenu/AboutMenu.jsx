import PropTypes from 'prop-types';

const AboutMenu = ({ getComponent }) => {
  const DropdownMenu = getComponent('DropdownMenu');
  const Link = getComponent('Link');

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <DropdownMenu label="About">
        <li>
          <Link href="https://swagger.io/tools/swagger-editor/" target="_blank">
            About Swagger Editor
          </Link>
        </li>
        <li>
          <Link
            href="https://swagger.io/docs/open-source-tools/swagger-editor-next/"
            target="_blank"
          >
            View Docs
          </Link>
        </li>
        <li>
          <Link href="https://github.com/swagger-api/swagger-editor/tree/next" target="_blank">
            View on GitHub
          </Link>
        </li>
      </DropdownMenu>
    </>
  );
};

AboutMenu.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default AboutMenu;
