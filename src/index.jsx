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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
