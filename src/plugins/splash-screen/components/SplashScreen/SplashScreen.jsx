import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import logo from '../../assets/logo.svg';
import { version } from '../../../../../package.json';

const SplashScreen = ({ isOpen = true, getComponent }) => {
  const SplashScreenSpinner = getComponent('SplashScreenSpinner');
  const [isHidden, setHidden] = useState(!isOpen);

  const handleTransitionEnd = () => {
    setHidden(true);
  };

  return (
    <div
      className={classNames('swagger-editor__splash-screen', {
        'swagger-editor__splash-screen--fade-out': !isOpen,
        'swagger-editor__splash-screen--hidden': isHidden,
      })}
      onTransitionEnd={handleTransitionEnd}
    >
      <figure className="swagger-editor__splash-screen-figure">
        <img width="100%" src={logo} alt="Swagger Editor" />
        <figcaption>{version}</figcaption>
        <SplashScreenSpinner />
      </figure>
    </div>
  );
};

SplashScreen.propTypes = {
  isOpen: PropTypes.bool,
  getComponent: PropTypes.func.isRequired,
};

export default SplashScreen;
