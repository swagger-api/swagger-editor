import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-extraneous-dependencies */
// import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
/* eslint-enable */

// import GenericEditorPlugin from './plugin';
// import './index.scss';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <SwaggerUI
//       plugins={[GenericEditorPlugin]}
//       layout="GenericEditorLayout"
//       url="https://petstore.swagger.io/v2/swagger.json"
//     />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// import App from './AppAsFunc';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
