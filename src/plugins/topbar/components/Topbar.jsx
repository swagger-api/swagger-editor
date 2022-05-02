import React from 'react';
import PropTypes from 'prop-types';

const Topbar = ({ getComponent, topbarActions, topbarSelectors }) => {
  const LinkHome = getComponent('LinkHome');
  const FileMenuDropdown = getComponent('FileMenuDropdown');
  const EditMenuDropdown = getComponent('EditMenuDropdown');
  const GeneratorMenuDropdown = getComponent('GeneratorMenuDropdown');

  return (
    <div className="topbar">
      <div className="topbar-wrapper">
        <LinkHome />
        <FileMenuDropdown
          getComponent={getComponent}
          topbarActions={topbarActions}
          topbarSelectors={topbarSelectors}
        />
        <EditMenuDropdown
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
  );
};

Topbar.propTypes = {
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  topbarSelectors: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};

export default Topbar;
