import YAML from 'js-yaml';

/* eslint-disable no-param-reassign */

// eslint-disable-next-line import/prefer-default-export
export const Raml10SchemaParser = () => ({
  async validate() {
    return [];
  },

  async parse({ message, defaultSchemaFormat }) {
    try {
      let { payload } = message;
      if (typeof payload === 'object') {
        payload = YAML.dump(payload);
      }

      message['x-parser-original-schema-format'] = message.schemaFormat || defaultSchemaFormat;
      message['x-parser-original-payload'] = payload;
      message.payload = { description: `\`\`\`raml\n${payload}\n\`\`\`` };
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  },

  getMimeTypes() {
    return ['application/raml+yaml;version=1.0'];
  },
});

/* eslint-enable */
