import throttle from 'lodash/throttle.js';

const throttledSpecUpdate = throttle(
  (spec, system) => {
    system.specActions.updateSpec(spec);
  },
  150,
  { leading: false }
);

const afterLoad = (system) => {
  const { editorPersistence } = system;

  if (!editorPersistence.has()) return;

  const spec = editorPersistence.get();

  throttledSpecUpdate(spec, system);
};

export default afterLoad;
