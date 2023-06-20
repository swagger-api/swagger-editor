import React, { memo } from 'react';
import PropTypes from 'prop-types';

import errorIcon from '../../assets/error-icon.svg';
import warningIcon from '../../assets/warning-icon.svg';
import infoIcon from '../../assets/info-icon.svg';
import hintIcon from '../../assets/hint-icon.svg';

const SeverityIcon = memo(({ severity }) => (
  <>
    {severity === 8 && <img src={errorIcon} alt="Error" width="13" height="13" />}
    {severity === 4 && <img src={warningIcon} alt="Warning" width="13" height="13" />}
    {severity === 2 && <img src={infoIcon} alt="Info" width="13" height="13" />}
    {severity === 1 && <img src={hintIcon} alt="Hint" width="13" height="13" />}
  </>
));

SeverityIcon.propTypes = {
  severity: PropTypes.oneOf([8, 4, 2, 1]).isRequired,
};

export default SeverityIcon;
