import React from 'react';
import PropTypes from 'prop-types';

import logo from '../../assets/logo-small.svg';

const Logo = ({ link }) => {
  const img = <img className="swagger-editor__top-bar-logo-img" src={logo} alt="Swagger Editor" />;

  return (
    <div className="swagger-editor__top-bar-logo">
      {link ? (
        <a href={link} rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
};

Logo.propTypes = {
  link: PropTypes.string,
};

Logo.defaultProps = {
  link: 'https://swagger.io/tools/swagger-editor/',
};

export default Logo;
