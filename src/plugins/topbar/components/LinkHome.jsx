import React from 'react';

import Logo from '../assets/logo-small.svg';

const LinkHome = () => (
  <div>
    <a href="/" rel="noopener noreferrer" className="link">
      <img className="topbar-logo__img" src={Logo} alt="" />
    </a>
  </div>
);

export default LinkHome;
