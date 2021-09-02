import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable import/no-extraneous-dependencies */
// import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
// eslint-disable-next-line import/order
// import HelloWorker from './hello.worker';
/* eslint-enable */

// import GenericEditorPlugin from './plugin';
import './index.scss';
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

// sample from: https://github.com/facebook/create-react-app/pull/3934
// const helloWorker = new HelloWorker();
// let messageCount = 0;

// helloWorker.postMessage({ run: true });

// helloWorker.onmessage = (event) => {
//   if (event.data.status) {
//     console.log('STATUS', event.data.status);
//   }

//   if (event.data.message) {
//     messageCount += 1;
//     console.log('MESSAGE', event.data.message);

//     if (messageCount >= 5) {
//       helloWorker.postMessage({ run: false });
//     }
//   }
// };
