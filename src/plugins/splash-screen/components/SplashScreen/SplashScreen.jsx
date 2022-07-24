import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// eslint-disable-next-line import/no-unresolved
import logo from '../../assets/logo.svg?raw';

const SplashScreen = ({ isOpen, getComponent }) => {
  const { PACKAGE_VERSION } = buildInfo; // eslint-disable-line no-undef
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
        <figcaption>{PACKAGE_VERSION}</figcaption>
        <SplashScreenSpinner />
      </figure>
    </div>
  );
};

SplashScreen.propTypes = {
  isOpen: PropTypes.bool,
  getComponent: PropTypes.func.isRequired,
};

SplashScreen.defaultProps = {
  isOpen: true,
};

export default SplashScreen;
