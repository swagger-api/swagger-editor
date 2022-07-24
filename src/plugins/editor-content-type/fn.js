import YAML from 'js-yaml';

/**
 * Checks if `content` is valid JSON string.
 *
 * @param content string
 * @returns {boolean}
 */
export const isValidJSON = (content) => {
  try {
    return JSON.parse(content) && true;
  } catch {
    return false;
  }
};

/**
 * Checks if `content` is valid JSON string containing object.
 *
 * @param content string
 * @returns {boolean}
 */
export const isValidJSONObject = (content) => {
  try {
    const obj = JSON.parse(content);
    return Object.prototype.toString.call(obj) === '[object Object]';
  } catch {
    return false;
  }
};

/**
 * Checks if `content` is valid YAML string.
 *
 * @param content string
 * @returns {boolean}
 */
export const isValidYAML = (content) => {
  try {
    return YAML.load(content) && true;
  } catch {
    return false;
  }
};

/**
 * Checks if `content` is valid YAML string containing object.
 *
 * @param content string
 * @returns {boolean}
 */
export const isValidYAMLObject = (content) => {
  try {
    const obj = YAML.load(content);
    return Object.prototype.toString.call(obj) === '[object Object]';
  } catch {
    return false;
  }
};
