import React from 'react';
import PropTypes from 'prop-types';

import MonacoEditor from '../components/MonacoEditor';
import './GenericEditorLayout.scss';

const GenericEditorLayout = ({ getComponent }) => {
  const BaseLayout = getComponent('BaseLayout', true);

  return (
    <div className="gel-layout">
      <header className="gel-header">
        <h1>TopBar</h1>
      </header>

      <main className="gel-editor">
        <MonacoEditor />
      </main>

      <aside className="gel-preview">
        <BaseLayout />
      </aside>
    </div>
  );
};

GenericEditorLayout.propTypes = {
  getComponent: PropTypes.func.isRequired,
};

export default GenericEditorLayout;
