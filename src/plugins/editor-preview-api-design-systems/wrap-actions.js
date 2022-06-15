import debounce from 'lodash/debounce.js';

const parseDebounced = debounce((spec, system) => {
  system.adsActions.parse(spec);
}, 500);

// eslint-disable-next-line import/prefer-default-export
export const updateSpec = (oriAction, system) => (payload) => {
  oriAction(payload);
  parseDebounced(payload, system);
};
