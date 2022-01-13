import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import 'swagger-ui-react/swagger-ui.css';

import App from './App.jsx';

const domContainer = document.getElementById('swagger-ide');

if (process.env.NODE_ENV !== 'test') {
  ReactModal.setAppElement(domContainer);
}

ReactDOM.render(<App />, domContainer);
