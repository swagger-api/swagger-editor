import React from 'react';
import ReactDOM from 'react-dom';
import ApiDOMParser from 'apidom-parser';
import * as jsonAdapter from 'apidom-parser-adapter-json';

import './index.scss';

import App from './App';
import reportWebVitals from './reportWebVitals';

(async () => {
  const parser = ApiDOMParser();
  parser.use(jsonAdapter);
  const result = await jsonAdapter.parse('{"prop":"val"}');
  console.dir(result);
})();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
