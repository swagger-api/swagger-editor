import React from 'react';
import PropTypes from 'prop-types';

const Topbar = (props) => {
  const { getComponent, topbarActions, topbarSelectors } = props;

  const LinkHome = getComponent('LinkHome');
  const FileMenuDropdownHooks = getComponent('FileMenuDropdownHooks');
  const EditMenuDropdownHooks = getComponent('EditMenuDropdownHooks');
  const GeneratorMenuDropdownHooks = getComponent('GeneratorMenuDropdownHooks');

  return (
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
        <GeneratorMenuDropdownHooks
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
