export default {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    return 'cssTransform';
  },
};
