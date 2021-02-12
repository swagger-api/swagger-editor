/* eslint-disable no-restricted-globals */
let helloInterval;

const sayHello = () => {
  self.postMessage({ message: 'Hello' });
};

self.addEventListener('message', (event) => {
  if (event.data.run === true) {
    self.postMessage({ status: 'Worker started' });
    helloInterval = setInterval(sayHello, 1000);
  }

  if (event.data.run === false) {
    self.postMessage({ status: 'Worker stopped' });
    clearInterval(helloInterval);
  }
});
