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
 * Checks if `content` is valid JSON string containing array.
 *
 * @param content string
 * @returns {boolean}
 */
export const isValidJSONArray = (content) => {
  try {
    const obj = JSON.parse(content);
    return Array.isArray(obj);
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

/**
 * Root fields of API descriptions. OpenAPI, Swagger, AsyncAPI and Arazzo documents may carry
 * a root `$schema` too; a root with any of these fields, whatever its value, is never a
 * standalone JSON Schema document. swagger-client, Swagger UI and apidom-ls apply the same rule.
 */
const API_DESCRIPTION_FIELDS = ['openapi', 'swagger', 'asyncapi', 'arazzo'];

/**
 * Checks if `root` is the root of a standalone JSON Schema document of `dialect`: an object
 * whose `$schema` is the dialect's meta-schema URI and that has none of the API description
 * fields. Only the root counts: nested schemas may carry `$schema` too.
 */
const isJSONSchemaRoot = (root, dialect) =>
  Object.prototype.toString.call(root) === '[object Object]' &&
  root.$schema === dialect &&
  !API_DESCRIPTION_FIELDS.some((field) => Object.prototype.hasOwnProperty.call(root, field));

/**
 * Checks if `content` is valid JSON string containing a standalone JSON Schema document.
 *
 * @param content string
 * @param dialect string, the dialect's meta-schema URI (the root `$schema` value)
 * @returns {boolean}
 */
export const isJSONSchemaDocumentJSON = (content, dialect) => {
  try {
    return isJSONSchemaRoot(JSON.parse(content), dialect);
  } catch {
    return false;
  }
};

/**
 * Checks if `content` is valid YAML string containing a standalone JSON Schema document.
 *
 * @param content string
 * @param dialect string, the dialect's meta-schema URI (the root `$schema` value)
 * @returns {boolean}
 */
export const isJSONSchemaDocumentYAML = (content, dialect) => {
  try {
    return isJSONSchemaRoot(YAML.load(content), dialect);
  } catch {
    return false;
  }
};
