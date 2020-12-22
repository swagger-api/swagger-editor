/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React, { PureComponent } from 'react';

import Logo from '../assets/logo_small.svg';

export default class LinkHome extends PureComponent {
  render() {
    return (
      <div>
        <a href="/" rel="noopener noreferrer" className="link">
          <img height="35" className="topbar-logo__img" src={Logo} alt="" />
        </a>
      </div>
    );
  }
}
