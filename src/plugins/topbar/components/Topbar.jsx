import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import './_all.scss';
import EditMenuDropdownHooks from './EditMenuDropdownHooks.jsx'; // getComponent incompatible with React hooks (due to nested functions?)
import FileMenuDropdownHooks from './FileMenuDropdownHooks.jsx'; // getComponent incompatible with React hooks (due to nested functions?)

// for screenreader aria-hidden
if (process.env.NODE_ENV !== 'test') {
  ReactModal.setAppElement('#root');
}

const Topbar = (props) => {
  const { getComponent, topbarActions, topbarSelectors } = props;

  const LinkHome = getComponent('LinkHome');
  const GeneratorMenuDropdown = getComponent('GeneratorMenuDropdown');

  return (
    <div className="swagger-ide-standalone">
      <div className="topbar">
        <div className="topbar-wrapper">
          <LinkHome />
          <FileMenuDropdownHooks
            getComponent={getComponent}
            topbarActions={topbarActions}
            topbarSelectors={topbarSelectors}
          />
          <EditMenuDropdownHooks
            getComponent={getComponent}
            topbarActions={topbarActions}
            topbarSelectors={topbarSelectors}
          />
          <GeneratorMenuDropdown
            getComponent={getComponent}
            topbarActions={topbarActions}
            topbarSelectors={topbarSelectors}
          />
        </div>
      </div>
    </div>
  );
};

Topbar.propTypes = {
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  topbarSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default Topbar;
