import throttle from 'lodash/throttle.js';

const throttledSpecUpdate = throttle(
  (spec, system) => {
    system.specActions.updateSpec(spec);
  },
  150,
  { leading: false }
);

const afterLoad = (system) => {
  const { editorLocalStorage } = system;

  if (!editorLocalStorage.has()) return;

  const spec = editorLocalStorage.get();

  throttledSpecUpdate(spec, system);
};

export default afterLoad;
