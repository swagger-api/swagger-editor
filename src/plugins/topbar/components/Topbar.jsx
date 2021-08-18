import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import EditMenuDropdownHooks from './EditMenuDropdownHooks'; // getComponent incompatible with React hooks (due to nested functions?)
import FileMenuDropdownHooks from './FileMenuDropdownHooks'; // getComponent incompatible with React hooks (due to nested functions?)

// for screenreader aria-hidden
if (process.env.NODE_ENV !== 'test') {
  ReactModal.setAppElement('#root');
}

export default function Topbar(props) {
  const { getComponent, topbarActions } = props;

  const LinkHome = getComponent('LinkHome');
  const FileMenuDropdown = getComponent('FileMenuDropdown');
  const EditMenuDropdown = getComponent('EditMenuDropdown');
  const GeneratorMenuDropdown = getComponent('GeneratorMenuDropdown');

  return (
    <div className="swagger-editor-standalone">
      <div className="topbar">
        <div className="topbar-wrapper">
          <LinkHome />
          <FileMenuDropdown getComponent={getComponent} topbarActions={topbarActions} />
          <EditMenuDropdown getComponent={getComponent} topbarActions={topbarActions} />
          <FileMenuDropdownHooks getComponent={getComponent} topbarActions={topbarActions} />
          <EditMenuDropdownHooks getComponent={getComponent} topbarActions={topbarActions} />
          <GeneratorMenuDropdown getComponent={getComponent} topbarActions={topbarActions} />
        </div>
      </div>
    </div>
  );
}

Topbar.propTypes = {
  topbarActions: PropTypes.oneOfType([PropTypes.object]).isRequired,
  getComponent: PropTypes.func.isRequired,
};
