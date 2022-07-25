/**
 * Creates action wrapper that avoids double dispatch.
 *
 * @param wrapper
 * @returns {function(*, *): function(...[*]): (*)}
 */
const createSafeActionWrapper = (wrapper) => {
  let lastFSA = null; // Flux Standard Action(FSA): action objects emitted through redux

  return (origAction, system) =>
    (...args) => {
      const fsa = origAction(...args);

      if (fsa === lastFSA) {
        return fsa;
      }

      wrapper(origAction, system)(...args);

      lastFSA = fsa;

      return fsa;
    };
};

export default createSafeActionWrapper;
